# Step 6: Monitor Statistics

In this step, you monitor the CDC and file statistics of the `SweetFactoryApp` Siddhi application you deployed and ran in the previous steps. WSO2 Integrator: SI ships pre-configured Grafana dashboards for this purpose. You host the dashboards in Grafana, with Prometheus scraping metrics directly from the SI server. For more information about these dashboards, see [Monitoring ETL Statistics with Grafana](../../admin/viewing-dashboards.md).

## Prerequisites

- The WSO2 Integrator: SI server is running, with `SweetFactoryApp` deployed (see [Step 3: Deploy the Siddhi Application](deploy-siddhi-application.md) and [Step 4: Run the Siddhi Application](run-siddhi-application.md)).

## Download the pre-configured dashboards

WSO2 Integrator: SI provides pre-configured dashboards in JSON format. For this scenario, download the following:

- [WSO2 Integrator: SI - Overall Statistics.json](https://github.com/wso2/product-integrator-si/blob/master/modules/distribution/carbon-home/resources/dashboards/overview-statistics/WSO2%20Streaming%20Integrator%20-%20Overall%20Statistics.json)
- [WSO2 Integrator: SI - App Statistics.json](https://github.com/wso2/product-integrator-si/blob/master/modules/distribution/carbon-home/resources/dashboards/overview-statistics/WSO2%20Streaming%20Integrator%20-%20App%20Statistics.json)
- [WSO2 Integrator: SI - CDC Statistics.json](https://github.com/wso2/product-integrator-si/blob/master/modules/distribution/carbon-home/resources/dashboards/cdc-statistics/WSO2%20Streaming%20Integrator%20-%20CDC%20Statistics.json)
- [WSO2 Integrator: SI - CDC Streaming Statistics.json](https://github.com/wso2/product-integrator-si/blob/master/modules/distribution/carbon-home/resources/dashboards/cdc-statistics/WSO2%20Streaming%20Integrator%20-%20CDC%20Streaming%20Statistics.json)
- [WSO2 Integrator: SI - File Sink Statistics.json](https://github.com/wso2/product-integrator-si/blob/master/modules/distribution/carbon-home/resources/dashboards/file-statistics/WSO2%20Streaming%20Integrator%20-%20File%20Sink%20Statistics.json)
- [WSO2 Integrator: SI - File Source Statistics.json](https://github.com/wso2/product-integrator-si/blob/master/modules/distribution/carbon-home/resources/dashboards/file-statistics/WSO2%20Streaming%20Integrator%20-%20File%20Source%20Statistics.json)
- [WSO2 Integrator: SI - File Statistics.json](https://github.com/wso2/product-integrator-si/blob/master/modules/distribution/carbon-home/resources/dashboards/file-statistics/WSO2%20Streaming%20Integrator%20-%20File%20Statistics.json)

## Configure SI to expose metrics

Open `<SI_HOME>/conf/server/deployment.yaml`. In the `wso2.metrics` section, set `enabled: true`:

```yaml
wso2.metrics:
  enabled: true
  reporting:
    console:
      - name: Console
        enabled: false
        pollingPeriod: 2
```

Add a `metrics.prometheus` section that exposes metrics on port 9005:

```yaml
metrics.prometheus:
  reporting:
    prometheus:
      - name: prometheus
        enabled: true
        serverURL: "http://localhost:9005"
```

Save the file. Restart the SI runtime so the configuration takes effect — stop any running Siddhi applications and click **Run** again, or restart the SI server in its terminal (see [Starting the WSO2 Integrator: SI server](set-up-environment-and-dependencies.md#starting-the-wso2-integrator-si-server)).

## Install and configure Prometheus

1. Download Prometheus from the [Prometheus download page](https://prometheus.io/download/).

2. Extract the downloaded archive. The extracted directory is referred to as `<PROMETHEUS_HOME>` from here on.

3. Open `<PROMETHEUS_HOME>/prometheus.yml` and add the SI metrics endpoint as a scrape target under `scrape_configs`:

    ```yaml
    scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['localhost:9005']
    ```

4. From the `<PROMETHEUS_HOME>` directory, start Prometheus on port 9091 (the default port 9090 conflicts with SI's HTTP interface, so specify an alternate port):

    ```sh
    ./prometheus --web.listen-address=:9091
    ```

5. Verify that Prometheus is scraping SI. Open `http://localhost:9091/targets` in a browser. The `prometheus` job should appear with its `localhost:9005` endpoint listed as `UP`.

## Install and configure Grafana

1. Download Grafana from [Grafana Labs - Download Grafana](https://grafana.com/grafana/download), then start it according to your installation method. For example, on macOS with Homebrew, run `brew services start grafana`.

2. Open `http://localhost:3000` in a browser. Sign in with the default credentials (`admin` / `admin`) and set a new password when prompted.

3. Add Prometheus as a data source:

    1. In the left sidebar, open **Connections → Data sources**.
    2. Click **+ Add new data source** and select **Prometheus**.
    3. In the **URL** field under **Connection**, enter `http://localhost:9091` (the port where you started Prometheus in the previous section).

        ![Prometheus configuration]({{base_path}}/images/cdc-monitoring/prometheus-configurations.png)

    4. (Optional) Enable **Default** to make Prometheus the default data source.
    5. Click **Save & test**. A success message confirms the data source is reachable.

        ![Save and test]({{base_path}}/images/cdc-monitoring/save-and-test.png)

4. Import each dashboard JSON file you downloaded earlier:

    1. In the left sidebar, open **Dashboards → New → Import**.
    2. Click **Upload dashboard JSON file** and select one of the dashboard files.
    3. (Optional) Change the **Unique Identifier (uid)** if prompted.
    4. Click **Import**.
    5. Repeat for each of the seven dashboard files.

## Enable the Siddhi application to publish statistics

By default, SI emits only server-level metrics (JVM, uptime, HTTP transports). To also emit per-Siddhi-application metrics — which the pre-configured SI app, file, and CDC dashboards depend on — add the `@App:statistics` annotation to the Siddhi application immediately below the `@App:name` annotation:

```siddhi
@App:name('SweetFactoryApp')
@App:statistics(reporter = 'prometheus')
```

Redeploy the application (see [Step 3: Deploy the Siddhi Application](deploy-siddhi-application.md)) for the annotation to take effect.

!!! note
    Without the `@App:statistics` annotation, the dashboards render but show no per-app data. This is the most common reason for empty SI app, file, or CDC dashboards.

## View the statistics

1. Insert records into the `production` database table to generate CDC events:

    ```sql
    insert into SweetProductionTable values('eclairs', 100.0);
    insert into SweetProductionTable values('toffee', 40.0);
    insert into SweetProductionTable values('gingerbread', 200.0);
    ```

    (You can also test the file-source → Kafka path directly by appending rows to `<YOUR_HOME>/productioninserts.csv`, which the `FilterStream` `@source(type='file')` reads. See [Step 5: Update the Siddhi Application](update-the-siddhi-application.md) for the full pipeline.)

2. Open Grafana, then navigate to **Dashboards** in the left sidebar.

    ![Access Grafana dashboards]({{base_path}}/images/quick-start-guide-101/access-grafana-dashboards.png)

    Open the **WSO2 Integrator: SI - Overall Statistics** dashboard:

    ![Overall Statistics]({{base_path}}/images/quick-start-guide-101/overall-staistics.png)

    !!! info
        The statistics displayed depend on the number of events generated in the configured time window. Adjust the time-range selector in the top-right if your recent events do not appear.

3. Under **Overview Statistics**, click **SweetFactoryApp** to open the **WSO2 Integrator: SI App Statistics** dashboard.

4. Scroll down to the **Sources** section to see the `file` and `cdc` sources used by `SweetFactoryApp`:

    ![Source statistics]({{base_path}}/images/quick-start-guide-101/file-source-statistics.png)

5. Scroll down to the **Destinations** section to see the `file` sink:

    ![Sink statistics]({{base_path}}/images/quick-start-guide-101/file-sink-statistics.png)

6. Under **Sources**, click the link to the `productioninserts.csv` file. The **WSO2 Integrator: SI - File Statistics** dashboard opens. Because the file is the output of one query and the input of another, statistics appear under both **Source** and **Sink**:

    **Source statistics**

    ![File statistics - Source]({{base_path}}/images/quick-start-guide-101/file-statistics-source.png)

    **Sink statistics**

    ![File statistics - Sink]({{base_path}}/images/quick-start-guide-101/file-statistics-sink.png)

7. On the **File Statistics** dashboard, under **Sources**, click the file link to open the **File Source Statistics** dashboard — detailed statistics for the file functioning as a source:

    ![File Source Statistics]({{base_path}}/images/quick-start-guide-101/file-statistics-source.png)

8. On the **File Statistics** dashboard, under **Destinations**, click the file link to open the **File Sink Statistics** dashboard — detailed statistics for the file functioning as a sink:

    ![File Sink Statistics]({{base_path}}/images/quick-start-guide-101/file-statistics-sink.png)

9. On the **App Statistics** dashboard, in the **CDC** section, click the **SweetProductionTable** link. The **CDC Statistics** dashboard opens with statistics generated for the `cdc` source:

    ![CDC Statistics]({{base_path}}/images/quick-start-guide-101/cdc-statistics.png)

    Under **Streaming**, click **SweetProductionTable**. The **CDC Streaming Statistics** dashboard opens:

    ![CDC Streaming Statistics]({{base_path}}/images/quick-start-guide-101/cdc-streaming-statistics.png)

!!! tip "What's Next?"
    - To package the `SweetFactoryApp` Siddhi application as a Docker artifact for containerized deployment, proceed to [Step 7: Export the Siddhi Application as a Docker Artifact](export-siddhi-application-as-docker.md).
    - To learn more about the key concepts of WSO2 Integrator: SI, see [Key Concepts](../../get-started/key-concepts.md).
    - For more hands-on experience, try the [Tutorials](../../tutorials/tutorials-overview.md).
    - For guidance on common Streaming Integration use cases, see [Use Cases](../../guides/use-cases.md).
    - To run WSO2 Integrator: SI in containerized environments, see [Running SI with Docker and Kubernetes](../../tutorials/running-si-with-docker-and-kubernetes.md).
