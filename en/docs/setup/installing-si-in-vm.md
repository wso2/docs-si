# Install SI

Follow the steps given below to install the WSO2 Integrator: SI.

## System requirements

| Type   | Requirement                                                                                     |
|--------|-------------------------------------------------------------------------------------------------|
| CPU    | You require a minimum of one CPU with 2 cores. It is recommended to have a CPU with 4 cores.    |
| Memory | ~ 4 GB minimum is recommended<br/> <br/>  ~ 2 GB heap size                                      |
| Disk   | ~ 1 GB minimum (excluding space allocated for log files and databases.)                         |

## Download and install WSO2 Integrator

WSO2 Integrator bundles all WSO2 integrators in a single application; you access SI by switching profiles.

1. Go to the [WSO2 Integrator downloads page](https://wso2.com/products/downloads/?product=wso2integrator). Enter your email address and agree to the license — you will receive an email with a link to download the installer.

2. Run the installer and open WSO2 Integrator. The home page opens with a **Configure** button in the top right corner.

    ![WSO2 Integrator home]({{base_path}}/images/qsg/wso2-integrator-home.png)

3. Click **Configure**, and under **Select your Integration Profile**, choose **WSO2 Integrator: SI**.

    ![Select SI profile]({{base_path}}/images/qsg/profile-selector.png)

4. WSO2 Integrator opens the SI setup page. If Java 21 or the SI runtime is not detected, click **Download Java & SI** to install both automatically. If you already have Java 21 or the SI runtime installed, expand **Advanced Options** to point WSO2 Integrator at your existing `JAVA_HOME` and SI installation directory.

    ![Download Java and SI runtime]({{base_path}}/images/qsg/runtime-setup.png)

## Locate SI_HOME

After installation, WSO2 Integrator places the SI runtime in a hidden folder under your user directory. The path varies by platform:

- **macOS/Linux:** `~/.wso2-si/streaming-integrator/wso2si-<VERSION>/`
- **Windows:** `C:\Users\<username>\.wso2-si\streaming-integrator\wso2si-<VERSION>\`

This directory is referred to as `<SI_HOME>` throughout this documentation. Because it sits inside a dotfile-prefixed folder, your file browser may hide it by default — toggle "Show hidden files" (`Cmd + Shift + .` on macOS; **View → Show → Hidden items** in File Explorer on Windows) to see it.

## Set JAVA_HOME

Set your `JAVA_HOME` environment variable to point to your JDK 21 installation directory.

=== "On macOS/Linux"
    ```bash
    export JAVA_HOME=/path/to/your/jdk-21
    ```
    To make the change persistent, add the line to your shell profile (e.g., `~/.zshrc` or `~/.bashrc`).
=== "On Windows"
    ```bash
    setx JAVA_HOME "C:\path\to\your\jdk-21"
    ```
    Open a new command prompt for the change to take effect.

For full instructions and the latest JDK download, see the [Oracle Java SE downloads page](https://www.oracle.com/java/technologies/downloads/).

## Starting the SI server

For day-to-day development, click **Run** in WSO2 Integrator and it manages the SI runtime for you. The commands below are for production-style deployments where you run SI standalone in a VM.

Follow the steps given below to start the server.

1. Open a command prompt as explained below.
2. Navigate to the `<SI_HOME>/bin` folder from your command line.
3. Execute one of the commands given below.

    - To start the server:

        === "On macOS/Linux"
            ```bash
            sh server.sh
            ```
        === "On Windows"
            ```bash
            server.bat
            ```

    - To start the server in background mode:

        === "On macOS/Linux"
            ```bash
            sh server.sh start
            ```
        === "On Windows"
            ```bash
            server.bat --start
            ```

## Stopping the SI server

- To stop the WSO2 Integrator: SI standalone application, go to the terminal and press <i>Ctrl+C</i>.
- To stop the WSO2 Integrator: SI in background mode:

    === "On macOS/Linux"
        ```bash
        sh server.sh stop
        ```
    === "On Windows"
        ```bash
        server.bat --stop
        ```

!!! tip "What's Next?"
    Once you have successfully downloaded and installed WSO2 Integrator: SI, you can proceed to do any of the following:<br/><br/>
    - If you were previously using WSO2 Stream Processor and want to migrate to WSO2 Integrator: SI, follow the instructions in [Migrating from WSO2 Stream Processor](migrating-from-stream-processor.md).<br/><br/>
    - To deploy WSO2 Integrator: SI as a single-node deployment or a cluster (based on your requirements), see [Deploying WSO2 Integrator: SI](deployment-guide.md).<br/><br/>
    - To set up WSO2 Integrator: SI and make it ready to run in a production environment, see the [Production Checklist](production-checklist.md).<br/><br/>
