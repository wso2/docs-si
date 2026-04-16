# Step 4: Run the Siddhi Application

In this step, let's run the `SweetFactoryApp` Siddhi application that you created, tested and deployed.

## Installing the required extensions

In [Step 2: Create the Siddhi Application](create-the-siddhi-application.md), you installed the `cdc-mysql` Siddhi extension in WSO2 Integrator: SI Tooling to test the `SweetFactoryApp` Siddhi application. Now let's install it in the WSO2 Integrator: SI server so that you can run the same Siddhi application there.

1. Start the WSO2 Integrator: SI server by navigating to the `<SI_HOME>/bin` directory from the CLI and running `./server.sh` (on Linux/macOS) or `server.bat --run` (on Windows).

2. Open a new terminal (keep the server running in the original) and navigate to `<SI_HOME>/bin`. Install the `cdc-mysql` extension by running `./extension-installer.sh install cdc-mysql` (on Linux/macOS) or `extension-installer.bat install cdc-mysql` (on Windows).

    Once the installation is complete, a message is logged to inform you that the extension is successfully installed.

3. Restart the WSO2 Integrator: SI server: return to the terminal where the server is running, press `Ctrl + C` to stop it, and start it again using the command from step 1.

## Generating an input event

To generate an input event, insert a record in the `production` database table by issuing the following command in the MySQL console.

`insert into SweetProductionTable values('chocolate',100.0);`

Then open the `<YOUR_HOME>/productioninserts.csv` file. The following record should be displayed.

![Updated File]({{base_path}}/images/quick-start-guide-101/updated-file.png)

!!! tip "What's Next?"
    Now you can try extending the `SweetFactoryApp` Siddhi application to perform more streaming integration activities. To try this, proceed to [Step 5: Update the Siddhi Application](update-the-siddhi-application.md).
