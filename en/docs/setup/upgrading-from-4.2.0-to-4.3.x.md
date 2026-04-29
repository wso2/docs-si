# Upgrading from WSO2 Integrator: SI 4.2.0 to 4.3.x

This page explains how to upgrade an existing WSO2 Integrator: SI 4.2.0 deployment to 4.3.x. The upgrade is largely a drop-in replacement: Siddhi applications, the `deployment.yaml` schema, and the `bin/` startup scripts are unchanged. The main changes are tooling (the legacy SI Tooling editor is replaced by a VS Code extension), an expanded JDK support range, and new Integration Control Plane (ICP) support for SI.

## Before you begin

- Download WSO2 Integrator: SI 4.3.x from the [product page](https://wso2.com/streaming-integrator/).
- Back up the `<SI_4.2.0_HOME>` directory, including any custom files in `wso2/server/deployment/siddhi-files/`, `conf/server/`, and `resources/`.
- Confirm your runtime JDK. SI 4.3.x supports JDK 1.8, 9, 10, 11, and **17** (4.2.0 supported up to JDK 11).

## What's new and what changes

| Area | 4.2.0 | 4.3.x | Action required |
|---|---|---|---|
| Development tooling | SI Tooling web editor | **WSO2 Integrator: SI** extension for VS Code | Install the VS Code extension. The Tooling editor is no longer shipped. |
| JDK support | 1.8–11 | 1.8–17 | None unless you want to move to JDK 17. |
| Siddhi runtime | 5.1.28 | 5.1.31 | Transparent. |
| Integration Control Plane (ICP) | Not available | New `org.wso2.carbon.si.management.icp.feature` | Optional. See [Monitoring SI Artifacts and Logs]({{base_path}}/admin/working-with-integration-control-plane/). |
| `deployment.yaml` schema | — | No schema changes | Bring your file across as-is (see Step 2). |
| `bin/` startup scripts | — | No behavioral changes | Reuse your 4.2.0 operational scripts. |
| Custom extension dependencies | `com.jayway.jsonpath:json-path`, `org.apache.james:apache-mime4j-core` | WSO2 orbit equivalents | Repoint group IDs in custom extensions. See [Step 5](#step-5-update-custom-extensions-if-applicable). |

## Step 1: Deploy the Siddhi applications

1. Copy every file from `<SI_4.2.0_HOME>/wso2/server/deployment/siddhi-files/` into `<SI_4.3.x_HOME>/wso2/server/deployment/siddhi-files/`.
2. Copy any other custom files you've added to `<SI_4.2.0_HOME>` to the same paths under `<SI_4.3.x_HOME>`. Common locations include:
    - `resources/` — custom JKS files and resources referenced from `conf/`.
    - `lib/` — JDBC drivers and other JARs you've dropped in.
    - `samples/sample-clients/lib/` — client-side dependencies, if used.

Siddhi application syntax is unchanged. No edits are required.

## Step 2: Bring across `deployment.yaml`

The `deployment.yaml` schema is unchanged between 4.2.0 and 4.3.1. You can copy your 4.2.0 `conf/server/deployment.yaml` directly to `<SI_4.3.x_HOME>/conf/server/deployment.yaml`.

!!! note
    If you have customized other config files in `conf/server/` (for example, `log4j2.xml` or `master-keys.yaml`), copy those across as well. Compare each file against the 4.3.x default to confirm no new keys are required for features you intend to enable.

## Step 3: Install the SI for VS Code extension

From 4.3.1 onward, the legacy SI Tooling web editor is no longer shipped. Use the VS Code extension instead. (4.3.0 users can continue using SI Tooling 4.3.0 if they prefer, but the VS Code extension is the supported tooling going forward.)

1. Install [Visual Studio Code](https://code.visualstudio.com/download).
2. From the Marketplace, install the **WSO2 Integrator: SI** extension (`WSO2.streaming-integrator`).
3. Open one of your existing `.siddhi` files in VS Code. The extension auto-detects the JDK and SI runtime on first open and prompts you through any missing setup.

For the full feature overview, see [WSO2 Integrator: SI for VS Code Overview]({{base_path}}/develop/si-for-vscode-overview/). For installation details, see [Install WSO2 Integrator: SI for VS Code]({{base_path}}/develop/install-si-for-vscode/).

!!! info
    Existing Siddhi applications open unchanged in the VS Code extension. If you used the Docker export or extension installer features in the SI Tooling editor, the same actions are available from the VS Code Command Palette as `SI: Export Siddhi Apps to Docker` and `SI: Extension Installer`.

## Step 4: Start the 4.3.x server and install required extensions

1. Navigate to `<SI_4.3.x_HOME>/bin/` and run:

    - **Linux/macOS:** `./server.sh`
    - **Windows:** `server.bat`

2. If the start-up logs report missing Siddhi extensions, run:

    - **Linux/macOS:** `./extension-installer.sh install`
    - **Windows:** `extension-installer.bat install`

   Restart the server after the installation completes.

## Step 5: Update custom extensions (if applicable)

Two third-party libraries were repackaged as WSO2 orbit artifacts in 4.3.x. If you maintain custom Siddhi extensions that depend on either directly, repoint the group IDs:

| Library | 4.2.0 coordinates | 4.3.x coordinates |
|---|---|---|
| jayway JsonPath | `com.jayway.jsonpath:json-path:2.2.0` | `org.wso2.orbit.com.jayway.jsonpath:json-path:2.9.0.wso2v1` |
| Apache Mime4j Core | `org.apache.james:apache-mime4j-core:0.7.2` | `org.wso2.orbit.org.apache.james:apache-mime4j-core:0.8.10.wso2v1` |

If your custom extensions don't depend on these libraries directly, no action is required.

## Step 6: Test the migration

1. Start the 4.3.x server and confirm there are no extension load errors in the log.
2. Simulate events for each migrated Siddhi application and verify the output. See [Testing a Siddhi Application]({{base_path}}/develop/testing-a-Siddhi-Application/).
3. If you use external state persistence (RDBMS or file system), confirm that the new server picks up the existing state. See [Configuring State Persistence]({{base_path}}/admin/configuring-Database-and-File-System-State-Persistence/).

## Helm-based deployments

If you deploy SI on Kubernetes using the [`wso2/helm-si`](https://github.com/wso2/helm-si) chart, the same chart targets 4.3.x. To upgrade:

1. Update the image tag and build version in your values file:

    ```yaml
    wso2:
      deployment:
        image:
          tag: "4.3.1-ubuntu"
        BuildVersion: "4.3.1"
    ```

2. Apply the change with `helm upgrade <release> . -f <your-values.yaml>`.

All other values from your 4.2.0 chart values file carry over. See `CONFIG.md` in the chart repository for the full value reference.

The 4.3.1 images published on Docker Hub at `wso2/wso2si` include `4.3.1-ubuntu`, `4.3.1-rocky`, and `4.3.1-alpine`. If your subscription pulls from the WSO2 private registry, confirm the equivalent tag is available there.

## Optional: Enable the Integration Control Plane

ICP support for SI is new in 4.3.x. ICP runs as a separate server that connects to one or more SI instances and provides monitoring and limited management for deployed Siddhi applications. Enabling ICP is optional and not required for the version upgrade itself. See [Monitoring SI Artifacts and Logs]({{base_path}}/admin/working-with-integration-control-plane/).
