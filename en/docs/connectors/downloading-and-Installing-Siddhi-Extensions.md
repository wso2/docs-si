# Downloading and Installing Siddhi Extensions

The Siddhi extensions supported for the WSO2 Integrator: SI are shipped with the product by default. If you need to install an additional extension or a different version of one, you can do so in two ways:

- Via the **Extension Installer** panel in WSO2 Integrator (recommended for development).
- Via the `extension-installer` script in the terminal (for production / headless setups).

The installation status terminology is the same in both paths.

## Understanding installation status

Each Siddhi extension has one of the following installation statuses, reported by both the **Extension Installer** panel and the `extension-installer` CLI:

| **Installation Status** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **INSTALLED**           | The extension is completely installed. The installation includes the JAR of the extension itself as well as all its dependencies (if any).                                                                                                                                                                                                                                                                                    |
| **NOT_INSTALLED**       | The extension has not been installed. The JAR of the extension itself has not been installed. Dependencies (if any) may already be installed due to shared dependencies.                                                                                                                                                                                                                                                      |
| **PARTIALLY_INSTALLED** | The JAR of the extension itself has been installed, but one or more dependencies still need to be installed. When this status is displayed with an asterisk (`PARTIALLY_INSTALLED (*)`), there are one or more dependencies that need to be manually installed for the extension. To view the dependencies that need to be installed, check the installation status of that specific extension individually (see below).     |
| **Restart Required**    | The installation or uninstallation of the extension is staged but not yet active. Reload WSO2 Integrator (or restart the SI server, for terminal installs) to complete the operation. This status appears only in the **Extension Installer** panel — the terminal flow prompts you to restart the SI server explicitly.                                                                                                      |

Status names appear in `UPPERCASE_WITH_UNDERSCORES` in the CLI and in Title Case in the **Extension Installer** panel.

## Installing extensions via WSO2 Integrator: SI

WSO2 Integrator includes an **Extension Installer** panel that lists all supported Siddhi extensions with their current installation status. You can install or uninstall extensions with a single click.

### Opening the Extension Installer panel

In WSO2 Integrator, open the command palette by pressing `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS), type `SI: Extension Installer`, and select the **SI: Extension Installer** option.

![Command palette]({{base_path}}/images/qsg/command-palette-extension-installer.png)

The **Extension Installer** panel opens.

![Extension Installer panel]({{base_path}}/images/qsg/extension-installer-panel.png)

To narrow down the list, enter all or part of an extension's name in the **Search** field at the top of the panel.

### Installing an extension

1. In the **Extension Installer** panel, locate the extension you want to install.

    ![Not installed extension]({{base_path}}/images/installing-siddhi-extensions/a-not-installed-extension.png)

2. Click **Install** for that extension, then confirm in the dialog box that appears.

3. Reload WSO2 Integrator after the installation completes. The extension's status changes to **Installed**.

    ![Installed status]({{base_path}}/images/installing-siddhi-extensions/installed-status.png)

### Uninstalling an extension

1. In the **Extension Installer** panel, locate the extension you want to uninstall.

    ![Installed extension]({{base_path}}/images/installing-siddhi-extensions/an-installed-extension.png)

2. Click **UnInstall** for that extension.

3. If the extension you are uninstalling has shared dependencies with one or more other extensions, a warning appears.

    ![Shared dependencies warning]({{base_path}}/images/installing-siddhi-extensions/shared-dependencies-exist-dialog-box.png)

    The names of the other extensions are in bold, and the dependencies each shares with the extension you are uninstalling are listed under the extension name.

    !!! note
        If you click **Confirm**, the other extensions that use the shared dependencies lose some of their dependencies. If you need to continue using those extensions, reinstall them after uninstallation.

    If there are no shared dependencies, click **UnInstall** in the confirmation dialog box.

4. Reload WSO2 Integrator after the uninstallation completes.

### Manually installable dependencies

Some Siddhi extensions have dependencies that the **Extension Installer** cannot auto-download. These dependencies must be manually downloaded and installed before the extension is fully usable.

When an extension has at least one such dependency, an information icon appears next to the extension's status in the **Extension Installer** panel:

![Manually installable dependencies icon]({{base_path}}/images/installing-siddhi-extensions/manually-installable-dependencies-available.png)

Click the icon to open a dialog box with details about each dependency.

![Manually installable dependency instructions]({{base_path}}/images/installing-siddhi-extensions/manually-installable-instructions.png)

For each dependency, the dialog box provides:

- **Instructions** to download (and, where applicable, convert) the JAR of the dependency.
- **Installation Location** where the downloaded JAR (or converted OSGi bundle) needs to be placed. Each location maps to one of the following directories:

    | **Installation Location** | **Directory**                                                                                                                  |
    |---------------------------|--------------------------------------------------------------------------------------------------------------------------------|
    | **bundle in runtime**     | Place the OSGi bundle you downloaded or converted in either `<SI_HOME>/lib` or `<SI_HOME>/bundles`, based on the instructions. |
    | **jar in runtime**        | Place the non-OSGi JAR you downloaded in `<SI_HOME>/jars`.                                                                     |
    | **jar in samples**        | Place the non-OSGi JAR you downloaded in `<SI_HOME>/samples/sample-clients/lib`.                                               |

If you are an extension developer and want to configure manually installable dependencies for a custom extension, see [Configuring Extension Dependencies](../develop/configuring-extension-dependencies.md).

## Installing extensions via the terminal

For production setups that don't use WSO2 Integrator, manage Siddhi extensions directly on the SI runtime via the `extension-installer` script. Navigate to `<SI_HOME>/bin` to issue these commands.

### Identifying installation status

- **Viewing the list of installed extensions** — view the complete list of Siddhi extensions currently installed in your WSO2 Integrator: SI setup. All listed extensions are completely installed (with their dependencies).

    === "On macOS/Linux"
        ```bash
        ./extension-installer.sh list
        ```
    === "On Windows"
        ```bash
        extension-installer.bat list
        ```

    The following is a sample response log for this command.

    ![List of Installed Extensions]({{base_path}}/images/downloading-and-installing-siddhi-extensions/list-response.png)

- **Viewing the installation status of all supported extensions** — view the complete list of Siddhi extensions supported for WSO2 Integrator: SI together with the current installation status of each.

    === "On macOS/Linux"
        ```bash
        ./extension-installer.sh list --all
        ```
    === "On Windows"
        ```bash
        extension-installer.bat list --all
        ```

    The following is a sample response.

    ![List of installed Siddhi extensions with status]({{base_path}}/images/downloading-and-installing-siddhi-extensions/list-and-status-response.png)

- **Checking the installation status of a specific extension** — view the installation status of one extension together with details of any dependencies that need to be manually downloaded.

    === "On macOS/Linux"
        ```bash
        ./extension-installer.sh list <EXTENSION_NAME>
        ```
    === "On Windows"
        ```bash
        extension-installer.bat list <EXTENSION_NAME>
        ```

    !!! info
        `<EXTENSION_NAME>` is the value displayed in the `name` column when you list extensions or check their status. For example, the extension name of the gRPC extension is `grpc`.

    For example, to view the installation status of the `cdc-oracle` extension (which is partially installed by default):

    === "On macOS/Linux"
        ```bash
        ./extension-installer.sh list cdc-oracle
        ```
    === "On Windows"
        ```bash
        extension-installer.bat list cdc-oracle
        ```

    Sample response:

    ![List status for specific extension]({{base_path}}/images/downloading-and-installing-siddhi-extensions/list-status-for-specific-extension.png)

### Installing extensions

#### Installing all extensions required for currently deployed Siddhi applications

If the Siddhi applications deployed in your WSO2 Integrator: SI setup use Siddhi extensions that are not currently installed, you can install all those extensions at once:

=== "On macOS/Linux"
    ```bash
    ./extension-installer.sh install
    ```
=== "On Windows"
    ```bash
    extension-installer.bat install
    ```

For example, if a deployed Siddhi application uses the Amazon S3 extension and that extension is not yet installed, the command above prints a message listing the extensions used in your applications but not installed, and prompts you to confirm.

![Not-installed extensions in Siddhi applications]({{base_path}}/images/downloading-and-installing-siddhi-extensions/not-installed-but-used-extensions.png)

If you enter `y`, installation proceeds and the following message confirms the installation status and prompts you to restart the SI server.

![installed missing extension]({{base_path}}/images/downloading-and-installing-siddhi-extensions/installed-missing-extension-message.png)

#### Installing a specific extension

To install a specific Siddhi extension by name:

=== "On macOS/Linux"
    ```bash
    ./extension-installer.sh install <EXTENSION_NAME>
    ```
=== "On Windows"
    ```bash
    extension-installer.bat install <EXTENSION_NAME>
    ```

For example, to install the `grpc` Siddhi extension:

=== "On macOS/Linux"
    ```bash
    ./extension-installer.sh install grpc
    ```
=== "On Windows"
    ```bash
    extension-installer.bat install grpc
    ```

The following message confirms the installation status and prompts you to restart the SI server.

![install extension log]({{base_path}}/images/downloading-and-installing-siddhi-extensions/install-extension-log.png)

### Uninstalling extensions

To uninstall a specific Siddhi extension:

=== "On macOS/Linux"
    ```bash
    ./extension-installer.sh uninstall <EXTENSION_NAME>
    ```
=== "On Windows"
    ```bash
    extension-installer.bat uninstall <EXTENSION_NAME>
    ```

For example, to uninstall the `grpc` Siddhi extension:

=== "On macOS/Linux"
    ```bash
    ./extension-installer.sh uninstall grpc
    ```
=== "On Windows"
    ```bash
    extension-installer.bat uninstall grpc
    ```

A message lists any other extensions that share dependencies with the one being uninstalled, and prompts you to confirm.

![uninstall extension log]({{base_path}}/images/downloading-and-installing-siddhi-extensions/uninstall-extension-log.png)

If you confirm, the uninstallation proceeds and the following log shows progress before prompting you to restart the SI server.

![uninstall extension]({{base_path}}/images/downloading-and-installing-siddhi-extensions/uninstall-extension.png)
