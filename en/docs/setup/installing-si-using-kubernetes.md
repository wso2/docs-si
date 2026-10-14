# Installing WSO2 Integrator: SI Using Kubernetes

You can deploy WSO2 Integrator: SI on Kubernetes using the WSO2 Helm chart in the [`wso2/helm-si`](https://github.com/wso2/helm-si) repository. The chart runs SI as a StatefulSet using the `wso2/wso2si` Docker image, and creates the Service, Ingress and configuration that SI needs.

!!! note
    The Siddhi Kubernetes operator is not supported with WSO2 Integrator: SI 4.4.x. Its resource definitions use Kubernetes APIs that were removed in Kubernetes 1.22, and it cannot run the current `wso2/wso2si` images. Use the Helm chart instead.

!!! tip "Before you begin:"
    - Start a Kubernetes cluster. For local testing, you can use a local cluster such as [Rancher Desktop](https://rancherdesktop.io/).
    - Install [kubectl](https://kubernetes.io/docs/tasks/tools/) and configure it to connect to your cluster.
    - Install [Helm](https://helm.sh/docs/intro/install/).
    - Install [Git](https://git-scm.com/downloads).

## Step 1: Get the Helm chart

Clone the `wso2/helm-si` repository and go to its root directory, which contains the chart.

```bash
git clone https://github.com/wso2/helm-si.git
cd helm-si
```

The chart is configured through the `values.yaml` file. For the full list of values, see [`CONFIG.md`](https://github.com/wso2/helm-si/blob/main/CONFIG.md).

## Step 2: Install WSO2 Integrator: SI

Install the chart as a release named `si` in a namespace named `si`.

```bash
helm install si . -n si --create-namespace
```

By default, the chart pulls the `wso2/wso2si` image from Docker Hub.

!!! info
    The chart enables AppArmor for the SI container by default. If your cluster nodes do not support AppArmor, as on some local clusters such as Rancher Desktop, the pod stays in the `Blocked` state with the message `Cannot enforce AppArmor: AppArmor is not enabled on the host`. In that case, disable AppArmor and recreate the pod:

    ```bash
    helm upgrade si . -n si --set wso2.deployment.securityContext.apparmor=false
    kubectl delete pod cloud-si-0 -n si
    ```

    The pod has to be deleted because Kubernetes does not replace a pod that never started. When you later install or upgrade the chart with your own values file, set `wso2.deployment.securityContext.apparmor` to `false` in that file too.

!!! info
    If you have a WSO2 subscription, you can use the updated images from the WSO2 private registry instead. Set `wso2.deployment.image.containerRegistry`, `wso2.deployment.image.repository`, `wso2.deployment.image.tag` and `wso2.deployment.imagePullSecrets` in your values file. For more information, see [How to use Docker images to receive updates](https://updates.docs.wso2.com/en/latest/updates/how-to-use-docker-images-to-receive-updates/).

## Step 3: Verify the deployment

1. Check that the SI pod is running.

    ```bash
    kubectl get pods -n si
    ```

    The pod is named `cloud-si-0`. It becomes ready (`1/1`) about a minute after it starts, once the readiness probe begins checking it.

    ```
    NAME         READY   STATUS    RESTARTS   AGE
    cloud-si-0   1/1     Running   0          90s
    ```

2. Check the SI log.

    ```bash
    kubectl logs -n si cloud-si-0
    ```

    The log contains a line similar to the following when SI has started.

    ```
    INFO {org.wso2.carbon.kernel.internal.CarbonStartupHandler} - WSO2 Integrator: SI started in 5.336 sec
    ```

## Step 4: Deploy a Siddhi application

Deploy Siddhi applications to the SI pod through the [Siddhi Application Management APIs](../ref/siddhi-Application-Management-APIs.md).

1. Save the following Siddhi application as `PowerSurgeDetection.siddhi`. It receives device power readings over HTTP on port `8080`, and logs an alert when a dryer uses 600W or more.

    ```sql
    @App:name("PowerSurgeDetection")
    @App:description("Consumes device power readings over HTTP and logs an alert when a dryer uses 600W or more.")

    @source(type='http', receiver.url='http://0.0.0.0:8080/checkPower', basic.auth.enabled='false', @map(type='json'))
    define stream DevicePowerStream(deviceType string, power int);

    @sink(type='log', prefix='LOGGER')
    define stream PowerSurgeAlertStream(deviceType string, power int);

    @info(name='surge-detector')
    from DevicePowerStream[deviceType == 'dryer' and power >= 600]
    select deviceType, power
    insert into PowerSurgeAlertStream;
    ```

2. In a separate terminal, forward the SI HTTPS port to your machine.

    ```bash
    kubectl port-forward -n si pod/cloud-si-0 9443:9443
    ```

3. Deploy the Siddhi application.

    ```bash
    curl -k -X POST "https://localhost:9443/siddhi-apps" \
      -u admin:admin \
      -H "Content-Type: text/plain" \
      --data-binary @PowerSurgeDetection.siddhi
    ```

    The response is similar to the following.

    ```
    {"type":"success","message":"Siddhi App saved succesfully and will be deployed in next deployment cycle"}
    ```

!!! warning
    `admin:admin` are the chart's default credentials, and are only suitable for local testing. Before you use the deployment for anything else, set a different administrator username and password with `wso2.config.admin.username` and `wso2.config.admin.password` in your values file. The password is Base64-encoded. For example, run `echo -n '<password>' | base64` and use the output as the value.

!!! note
    A Siddhi application deployed through the API is saved inside the pod, so it is lost if the pod is recreated. Deploy your Siddhi applications again after the pod restarts, or keep them on shared storage. The chart can mount the Siddhi applications directory from a shared persistent volume on AWS, Azure or Google Cloud when you set `provider` and `wso2.deployment.mountSiddhiApps`. For the values your cloud provider needs, see [`CONFIG.md`](https://github.com/wso2/helm-si/blob/main/CONFIG.md).

## Step 5: Try out the Siddhi application

1. In a separate terminal, forward the port of the Siddhi application's HTTP source to your machine.

    ```bash
    kubectl port-forward -n si pod/cloud-si-0 8080:8080
    ```

2. Send an event to the Siddhi application.

    ```bash
    curl -X POST "http://localhost:8080/checkPower" \
      -H "Content-Type: application/json" \
      -d '{"event": {"deviceType": "dryer", "power": 600}}'
    ```

3. Check the SI log.

    ```bash
    kubectl logs -n si cloud-si-0 | grep LOGGER
    ```

    A log entry similar to the following appears for each matching event.

    ```
    INFO {io.siddhi.core.stream.output.sink.LogSink} - LOGGER : Event{timestamp=1791907920071, data=[dryer, 600], isExpired=false}
    ```

!!! info
    The chart does not create a Service for the ports that your Siddhi applications listen on. To receive events from outside the cluster, create a Service, and an Ingress or load balancer if required, for those ports.

## Access SI from outside the cluster

The chart creates an Ingress that routes the Siddhi Application Management APIs (`/siddhi-apps`) to SI, using the hostname in `wso2.deployment.hostname` (`si.wso2.com` by default). The Ingress is configured for the [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/), so install it in your cluster to use the Ingress.

SI serves these APIs over HTTPS, so the Ingress connects to SI over HTTPS (`wso2.ingress.backendProtocol` is `HTTPS`). If you change it to `AUTO_HTTP`, NGINX connects to SI over plain HTTP and the requests fail with `502 Bad Gateway`.

To disable the Ingress, set `wso2.ingress.enabled` to `false`. For the other routing options of the chart, see [`CONFIG.md`](https://github.com/wso2/helm-si/blob/main/CONFIG.md).

## Configure SI

The chart generates the SI `deployment.yaml` file from the template in its `confs/deployment.yaml` file, filled in with the values in the `wso2.config` section of `values.yaml`. Settings that are not exposed as values are fixed in that template. To change the configuration, create your own values file with the values you want to override, and pass it when you install or upgrade the chart.

```bash
helm install si . -n si --create-namespace -f my-values.yaml
```

For all the values you can set, see [`CONFIG.md`](https://github.com/wso2/helm-si/blob/main/CONFIG.md).

## Upgrade or uninstall

To apply changes to your values, or to move to a newer version of the chart, run:

```bash
helm upgrade si . -n si -f my-values.yaml
```

To remove SI from the cluster, run:

```bash
helm uninstall si -n si
```
