# Step 3: Deploy the Siddhi Application

The `SweetFactoryApp` Siddhi application you created in [Step 2: Create the Siddhi Application](create-the-siddhi-application.md) needs to be deployed to the WSO2 Integrator: SI runtime before it can process live data from MySQL.

When you click **Run** in WSO2 Integrator (as you did in Step 2 to test the application), the application is deployed to the SI runtime automatically.

If you want to deploy the application *without* using WSO2 Integrator (for example, for a production-style deployment driven from the terminal), use one of the following two alternatives.

## Method 1: Copy the Siddhi application file to the deployment directory

Copy the `SweetFactoryApp.siddhi` file from your workspace into the `<SI_HOME>/wso2/server/deployment/siddhi-files/` directory. The SI server auto-deploys any `.siddhi` file placed in this directory, either at startup or while the server is running. To start the server manually, see [Starting the WSO2 Integrator: SI server](set-up-environment-and-dependencies.md#starting-the-wso2-integrator-si-server).

## Method 2: Deploy via WSO2 Integrator: SI

Alternatively, WSO2 Integrator: SI can register a separately-managed SI server and deploy the application to it on your behalf.

1. With the `SweetFactoryApp.siddhi` file open, open the command palette (`Ctrl + Shift + P`, or `Cmd + Shift + P` on macOS) and run `SI: Add SI server`. A dropdown titled **Select WSO2 Integrator: SI Server Path** appears, listing any previously registered servers and an **Add WSO2 Integrator: SI Server** option at the bottom.

    ![Select WSO2 Integrator: SI Server Path]({{base_path}}/images/quick-start-guide-101/select-si-server-path.png)

2. Select **Add WSO2 Integrator: SI Server**. A folder selector opens. Navigate to and select your `<SI_HOME>` directory. If the folder is not a valid SI server, an error appears reading `Invalid WSO2 Integrator: SI Server path or unsupported WSO2 Integrator: SI version.` — navigate to the correct `<SI_HOME>` directory and try again.

---

When deployment succeeds, a log line similar to the following is written to the SI server's logs:

```text
INFO {org.wso2.carbon.streaming.integrator.core.internal.StreamProcessorService} - Siddhi App SweetFactoryApp deployed successfully
```

!!! tip "What's Next?"
    Now that `SweetFactoryApp` is deployed, proceed to [Step 4: Run the Siddhi Application](run-siddhi-application.md) to generate real input events from MySQL and verify the application end-to-end.
