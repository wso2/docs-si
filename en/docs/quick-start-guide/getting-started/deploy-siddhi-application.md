# Step 3: Deploy the Siddhi Application

The `SweetFactoryApp` Siddhi application you created in [Step 2: Create the Siddhi Application](create-the-siddhi-application.md) needs to be deployed to the WSO2 Integrator: SI server before it can process live data from MySQL. In this step, you deploy the application to the server.

You can deploy the Siddhi application in one of two ways.

## Method 1: Copy the Siddhi application file to the deployment directory

Copy the `SweetFactoryApp.siddhi` file from your VSCode workspace into the `<SI_HOME>/wso2/server/deployment/siddhi-files/` directory. The SI server auto-deploys any `.siddhi` file placed in this directory, either at startup or while the server is running.

## Method 2: Deploy from VSCode via the WSO2 Integrator: SI extension

Alternatively, the **WSO2 Integrator: SI** extension can handle the deployment for you.

1. With the `SweetFactoryApp.siddhi` file open in VSCode, open the command palette (`Ctrl + Shift + P`, or `Cmd + Shift + P` on macOS) and run `SI: Add SI server`. A dropdown titled **Select WSO2 Integrator: SI Server Path** appears, listing any previously registered servers and an **Add WSO2 Integrator: SI Server** option at the bottom.

    ![Select WSO2 Integrator: SI Server Path]({{base_path}}/images/quick-start-guide-101/select-si-server-path.png)

2. Select **Add WSO2 Integrator: SI Server**. A folder selector opens. Navigate to and select your `<SI_HOME>` directory. If the folder is not a valid SI server, the extension shows the error `Invalid WSO2 Integrator: SI Server path or unsupported WSO2 Integrator: SI version.` — navigate to the correct `<SI_HOME>` directory and try again.

---

In both cases, when the deployment succeeds, a log line similar to the following appears in the terminal running the SI server:

```
INFO {org.wso2.carbon.streaming.integrator.core.internal.StreamProcessorService} - Siddhi App SweetFactoryApp deployed successfully
```

!!! tip "What's Next?"
    Now that `SweetFactoryApp` is deployed, proceed to [Step 4: Run the Siddhi Application](test-siddhi-application.md) to start the SI server, install the required CDC extension, and verify the application by generating input events.
