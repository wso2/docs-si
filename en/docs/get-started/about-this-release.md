# About this Release

WSO2 Integrator: SI 4.3.x is a feature and dependency upgrade over 4.2.0. The Siddhi runtime, `deployment.yaml` schema, and operational scripts in `bin/` are unchanged in behavior, so existing 4.2.0 Siddhi applications and configurations carry forward without modification.

## What's new

- **WSO2 Integrator: SI for VS Code extension.** A new Visual Studio Code extension provides the development environment for designing, developing, debugging, and testing Siddhi applications. Install it from the Marketplace as `WSO2.streaming-integrator`. See [Install WSO2 Integrator: SI for VS Code]({{base_path}}/develop/install-si-for-vscode/) and the [overview]({{base_path}}/develop/si-for-vscode-overview/).

- **Integration Control Plane (ICP) support for SI.** A new feature, `org.wso2.carbon.si.management.icp.feature`, lets the Integration Control Plane monitor SI instances and surface deployed Siddhi applications, runtime status, and limited management actions. ICP runs as a separate server and is optional. See [Monitoring SI Artifacts and Logs]({{base_path}}/admin/working-with-integration-control-plane/).

- **JDK 17 support.** The supported JDK range now spans 1.8 through 17. Existing JDK 11 deployments continue to work.

- **Updated runtime dependencies.** Siddhi 5.1.31, Carbon Kernel 5.3.2, Carbon Analytics 3.0.76, Jackson 2.16.0, Guava 32.1.3, log4j 2.22.1 (via Siddhi), and refreshed Siddhi I/O and execution extensions. These bumps are transparent for standard deployments.

## Deprecations

- **WSO2 Integrator: SI Tooling editor.** The legacy web-based SI Tooling editor is no longer shipped. Use the VS Code extension for all development work. Existing `.siddhi` files open unchanged in the new extension.

## Notes for custom extension authors

Two third-party libraries were repackaged as WSO2 orbit artifacts. If you maintain custom Siddhi extensions that depend on either directly, repoint the group IDs in your `pom.xml`:

| Library | Old coordinates | New coordinates |
|---|---|---|
| jayway JsonPath | `com.jayway.jsonpath:json-path:2.2.0` | `org.wso2.orbit.com.jayway.jsonpath:json-path:2.9.0.wso2v1` |
| Apache Mime4j Core | `org.apache.james:apache-mime4j-core:0.7.2` | `org.wso2.orbit.org.apache.james:apache-mime4j-core:0.8.10.wso2v1` |

If your custom extensions don't depend on these libraries directly, no action is required.

## Upgrading from a previous version

For upgrading from 4.2.0, see [Upgrading from WSO2 Integrator: SI 4.2.0 to 4.3.x]({{base_path}}/setup/upgrading-from-4.2.0-to-4.3.x/).

## Download the latest release

- Get the latest version of WSO2 Integrator: SI 4.3.1: [Download here](https://wso2.com/streaming-integrator/).
