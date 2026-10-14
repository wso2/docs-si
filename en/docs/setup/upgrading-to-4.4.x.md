# Upgrading to WSO2 Integrator: SI 4.4.x

This page explains how to upgrade an existing WSO2 Integrator: SI 4.2.0, 4.3.x or 4.4.0 deployment to the latest 4.4.x release, 4.4.1. The upgrade is largely a drop-in replacement: Siddhi applications and the `deployment.yaml` schema are unchanged. The main changes are the supported JDK versions, a development tooling switch, and updated extension versions, including a major Debezium version bump in the CDC extension.

## Before you begin

- Download WSO2 Integrator: SI 4.4.1 from the [product page](https://wso2.com/streaming-integrator/).
- Back up the `<OLD_SI_HOME>` directory, including any custom files in `wso2/server/deployment/siddhi-files/`, `conf/server/`, `lib/`, and `resources/`.
- Install a supported JDK. SI 4.4.1 supports JDK 17, 21 and 25, and JDK 25 is recommended. JDK 8 and 11 are not supported. See [Environment Compatibility](../ref/environment-compatibility.md).

## What's new and what changes

| Area | 4.3.x | 4.4.0 | 4.4.1 | Action required |
|---|---|---|---|---|
| JDK | — | JDK 21 recommended | JDK 17, 21 and 25, with JDK 25 recommended | Point `JAVA_HOME` at JDK 17 or later. See [Step 1](#step-1-set-up-the-jdk). |
| Development tooling | **WSO2 Integrator: SI** VS Code extension | WSO2 Integrator (standalone IDE) or **WSO2 Integrator** VS Code extension | Same as 4.4.0, with SI 4.4.1 and JDK 17 to 25 available during setup | Install WSO2 Integrator or the new VS Code extension. The **WSO2 Integrator: SI** extension is no longer recommended. See [Step 5](#step-5-update-development-tooling). |
| CDC extension (`siddhi-io-cdc`) | Debezium 1.x | Debezium 2.x, security fixes | Bug and security fixes | Reinstall the extension via the extension installer. See [Step 4](#step-4-start-the-server-and-install-required-extensions). |
| Other extensions (File, gRPC, HTTP, Kafka, MongoDB, WebSocket and others) | Previous version | Security fixes | Bug and security fixes | Reinstall the extensions (handled in Step 4). |
| Kubernetes deployment | Siddhi Kubernetes operator | Siddhi Kubernetes operator | WSO2 Helm chart (`wso2/helm-si`). The Siddhi Kubernetes operator is not supported. | Move your Kubernetes deployment to the Helm chart. See [Step 7](#step-7-move-kubernetes-deployments-to-the-helm-chart). |
| Startup scripts (`carbon.sh`, `carbon.bat`) | — | — | Updated for newer JDKs | Do not copy old copies across. Reapply any customizations to the new files. |
| Security fixes | — | Dependency CVEs patched | Dependency CVEs patched | None. |
| `deployment.yaml` schema | — | Unchanged | Unchanged | Bring your file across as-is (see [Step 3](#step-3-bring-across-deploymentyaml)). |
| Siddhi application syntax | — | Unchanged | Unchanged | No edits required. |

!!! info "Upgrading from 4.4.0?"
    Follow Steps 1 to 4, then Step 7 if you deploy SI to Kubernetes with the Siddhi Kubernetes operator, and Step 8. Step 5 applies only if you still use the **WSO2 Integrator: SI** VS Code extension, and Step 6 applies only if you are upgrading from 4.2.0.

!!! info "Upgrading from 4.2.0?"
    If you are upgrading from 4.2.0, two additional steps apply: custom extension dependency coordinates changed in 4.3.x and must be updated. See [Step 6](#step-6-update-custom-extensions-for-users-upgrading-from-420). The SI Tooling web editor (shipped with 4.2.0) was also removed in 4.3.x; follow [Step 5](#step-5-update-development-tooling) to install the new tooling.

## Step 1: Set up the JDK

Install JDK 25, or JDK 17 or 21, and set `JAVA_HOME` to point to it. See [Set JAVA_HOME](installing-si-in-vm.md#set-java_home).

If you start SI from WSO2 Integrator, no action is needed: WSO2 Integrator comes with Java 25. If you use the WSO2 Integrator VS Code extension, select the JDK on the SI setup page, or let it download JDK 25 if it cannot find a supported JDK.

## Step 2: Deploy the Siddhi applications

1. Copy every file from `<OLD_SI_HOME>/wso2/server/deployment/siddhi-files/` into `<NEW_SI_HOME>/wso2/server/deployment/siddhi-files/`.

2. Copy any other custom files you've added to `<OLD_SI_HOME>` to the same paths under `<NEW_SI_HOME>`. Common locations include:
    - `resources/` — custom JKS files and resources referenced from `conf/`.
    - `lib/` — JDBC drivers and other JARs you've dropped in. Copy only the JARs you added. Do not copy extension JARs installed by the extension installer, or JARs shipped with the old pack, because the new pack ships newer versions.
    - `samples/sample-clients/lib/` — client-side dependencies, if used.

Siddhi application syntax is unchanged between 4.2.0, 4.3.x and 4.4.x. No edits are required.

## Step 3: Bring across `deployment.yaml`

The `deployment.yaml` schema is unchanged from 4.2.0 through 4.4.1. You can copy your existing `conf/server/deployment.yaml` directly to `<NEW_SI_HOME>/conf/server/deployment.yaml`.

!!! note
    If you have customized other config files in `conf/server/` (for example, `log4j2.xml` or `master-keys.yaml`), copy those across as well. Compare each file against the 4.4.1 default to confirm no new keys are required for features you intend to enable.

!!! note
    In 4.4.1, Kafka source options set in `deployment.yaml` take precedence over the values in the Siddhi application. In earlier versions, the values in the Siddhi application were used instead. If you set `seq.enabled`, `optional.configuration`, `is.binary.message`, `enable.offsets.commit`, `enable.async.commit` or `topic.offsets.map` for the Kafka source in `deployment.yaml`, check that these values are the ones you want. See [Configuring System Parameters for Siddhi Extensions](../connectors/configuring-System-Parameters-for-Siddhi-Extensions.md).

## Step 4: Start the server and install required extensions

Because 4.4.1 is a new SI pack, all extensions must be reinstalled. The extension installer in 4.4.1 installs the updated extension versions.

1. Navigate to `<NEW_SI_HOME>/bin/` and run:

    - **Linux/macOS:** `./server.sh`
    - **Windows:** `server.bat`

2. Install your extensions using either WSO2 Integrator or the `extension-installer` script:

    - **Via WSO2 Integrator:** Open the **Extension Installer** panel and install each required extension.
    - **Via script:** Run the following from `<NEW_SI_HOME>/bin/`:

        - **Linux/macOS:** `./extension-installer.sh install`
        - **Windows:** `extension-installer.bat install`

    Restart the server after the installation completes.

3. **CDC extension note:** From 4.4.0, the `siddhi-io-cdc` extension uses Debezium 2.x. The extension installer handles the upgrade transparently — reinstall as you would any other extension.

## Step 5: Update development tooling

The **WSO2 Integrator: SI** VS Code extension (`WSO2.streaming-integrator`) is no longer recommended. Use one of the following instead:

**Option A — WSO2 Integrator (standalone IDE)**

1. Download and install WSO2 Integrator from the [WSO2 website](https://wso2.com/integrator/).
2. Open your existing `.siddhi` files directly. No changes to file format are required.

**Option B — WSO2 Integrator VS Code extension**

1. In VS Code, install the **WSO2 Integrator** extension from the Marketplace.
2. Disable or uninstall the old **WSO2 Integrator: SI** extension to avoid conflicts.
3. Open your existing `.siddhi` files. No changes to file format are required.

For an overview of the WSO2 Integrator editor experience and features, see [WSO2 Integrator: SI Overview]({{base_path}}/develop/si-overview/).

!!! info "Upgrading from 4.2.0?"
    If you used the legacy SI Tooling web editor (shipped with 4.2.0), you do not have a VS Code extension to uninstall. Install either Option A or Option B above.

## Step 6: Update custom extensions (for users upgrading from 4.2.0)

!!! info
    Skip this step if you are upgrading from 4.3.x or 4.4.0. This step only applies to users upgrading directly from 4.2.0.

Two third-party libraries were repackaged as WSO2 orbit artifacts in 4.3.x. If you maintain custom Siddhi extensions that depend on either directly, repoint the group IDs:

| Library | 4.2.0 coordinates | 4.4.1 coordinates |
|---|---|---|
| jayway JsonPath | `com.jayway.jsonpath:json-path:2.2.0` | `org.wso2.orbit.com.jayway.jsonpath:json-path:2.9.0.wso2v1` |
| Apache Mime4j Core | `org.apache.james:apache-mime4j-core:0.7.2` | `org.wso2.orbit.org.apache.james:apache-mime4j-core:0.8.11.wso2v1` |

If your custom extensions don't depend on these libraries directly, no action is required.

## Step 7: Move Kubernetes deployments to the Helm chart

!!! info
    Skip this step if you do not deploy SI to Kubernetes with the Siddhi Kubernetes operator, for example with the operator files from earlier versions of this documentation or the Kubernetes artifacts exported by the editor.

The Siddhi Kubernetes operator is not supported with WSO2 Integrator: SI 4.4.x. Its resource definitions use Kubernetes APIs that were removed in Kubernetes 1.22, and it cannot run the current `wso2/wso2si` images. Deploy SI with the WSO2 Helm chart instead.

1. Install SI with the Helm chart. See [Installing WSO2 Integrator: SI Using Kubernetes](installing-si-using-kubernetes.md).
2. Deploy the Siddhi applications from your `SiddhiProcess` resources to the new deployment as `.siddhi` files, through the Siddhi Application Management APIs. See [Step 4: Deploy a Siddhi application](installing-si-using-kubernetes.md#step-4-deploy-a-siddhi-application).
3. Once the new deployment is working, delete your `SiddhiProcess` resources and uninstall the Siddhi operator.

## Step 8: Test the migration

1. Start the 4.4.1 server and confirm there are no extension load errors in the log.
2. Simulate events for each migrated Siddhi application and verify the output. See [Testing a Siddhi Application]({{base_path}}/develop/testing-a-Siddhi-Application/).
3. If you use the CDC extension, confirm that your CDC sources are receiving events correctly.
4. If you use external state persistence (RDBMS or file system), confirm that the new server picks up the existing state. See [Configuring State Persistence]({{base_path}}/admin/configuring-Database-and-File-System-State-Persistence/).

## Helm-based deployments

If you deploy SI on Kubernetes using the [`wso2/helm-si`](https://github.com/wso2/helm-si) chart, update the image tag and build version in your values file:

```yaml
wso2:
  deployment:
    image:
      tag: "<VERSION>-ubuntu"
    BuildVersion: "<VERSION>"
```

Replace `<VERSION>` with the SI version you are upgrading to, for example `4.4.1`.

Apply the change with `helm upgrade <release> . -f <your-values.yaml>`.

All other values from your previous chart values file carry over. The images published on Docker Hub at `wso2/wso2si` include `<VERSION>-ubuntu`, `<VERSION>-rocky` and `<VERSION>-alpine` variants. See the [`wso2/wso2si` tags on Docker Hub](https://hub.docker.com/r/wso2/wso2si/tags) for the available versions. If your subscription pulls from the WSO2 private registry, confirm the equivalent tag is available there.
