# Install SI

Follow the steps given below to install the WSO2 Streaming Integrator.

## System requirements

| Type   | Requirement                                                                                     |
|--------|-------------------------------------------------------------------------------------------------|
| CPU    | You require a minimum of one CPU with 2 cores. It is recommended to have a CPU with 4 cores.    |
| Memory | ~ 4 GB minimum is recommended</br> </br>  ~ 2 GB heap size                                      |
| Disk   | ~ 1 GB minimum (excluding space allocated for log files and databases.)                         |

## Download and install

Go to the WSO2 Streaming Integrator [product page](https://wso2.com/streaming-integrator/), click **Download**, and then click Zip Archive to download the Streaming Integrator as a ZIP file.

Extract the archive file to a dedicated directory for the Steaming Integrator, which will hereafter be referred to as `<SI_HOME>`.

You must set your `JAVA_HOME` environment variable to point to the directory where the Java Development Kit (JDK) is installed on the computer.

## Starting the SI server

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

        === ""On macOS/Linux"
            ```bash 
            sh server.sh start
            ```
        === "On Windows"
            ```bash
            server.bat --start
            ```

## Stopping the SI server

- To stop the Streaming Integrator standalone application, go to the terminal and press <i>Ctrl+C</i>.
- To stop the Micro Integrator in background mode:

    === "On macOS/Linux"
        ```bash
        sh server.sh stop
        ```
    === "On Windows"
        ```bash
        server.bat --stop
        ```

!!! tip "What's Next?"
    Once you have successfully downloaded and installed WSO2 Streaming Integrator, you can proceed to do any of the following:<br/><br/>
    - If you were previously using WSO2 Stream Processor and want to migrate to WSO2 Streaming Integrator, follow the instructions in [Migrating from WSO2 Stream Processor](migrating-from-stream-processor.md).<br/><br/>
    - To deploy WSO2 Streaming Integrator as a single-node deployment or a cluster (based on your requirements), see [Deploying Streaming Integrator](deployment-guide.md).<br/><br/>
    - To set up WSO2 Streaming Integrator and make it ready to run in a production environment, see the [Production Checklist](production-checklist.md).<br/><br/>
    