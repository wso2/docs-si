# Step 2: Create the Siddhi Application

Let's create your first Siddhi application.

For this purpose, you can consider an example where production information is published in a database table. This information needs to be captured as and when it is published in the database, and published in a file after changing the case of the product name.

The following image depicts the procedure to be followed by the Siddhi application you create.

![Siddhi Application Flow]({{base_path}}/images/quick-start-guide-101/scenario.png)

## Open the WSO2 Integrator welcome page

1. If you have not already done so, install WSO2 Integrator and switch to the WSO2 Integrator: SI profile (see [Step 1: Set up your environment and dependencies](set-up-environment-and-dependencies.md#setting-up-wso2-integrator-si)).

2. Open WSO2 Integrator. Open the command palette by pressing `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS), type `WSO2 Integrator: Open Welcome Page`, and select it. The welcome page opens.

    ![WSO2 Integrator home page](http://localhost:8000/images/qsg/wso2-integrator-home.png)

    !!! note
        WSO2 Integrator: SI commands appear in the WSO2 Integrator command palette only after WSO2 Integrator: SI activates, which happens when a `.siddhi` file is open. If typing `SI:` in the palette returns no results, open or create a `.siddhi` file first and then reopen the palette.

3. On the welcome page, click **Configure** in the top right corner, and select **WSO2 Integrator: SI** under **Select your Integration Profile** (if you have not already done so).

4. Create a new project. A new `.siddhi` file opens for you to work in.

    ![New Siddhi File]({{base_path}}/images/Creating-Siddhi-Applications/New_Siddhi_File.png)

!!! tip "Prefer to build visually?"
    Siddhi applications can also be designed visually in the **Graphical View** by dragging and dropping flow constructs. For a worked example, see [Build a Siddhi Application with the Graphical View](../../develop/build-siddhi-app-with-graphical-view.md).

## Name the Siddhi application

Specify a name for the new Siddhi application via the `@App:name` annotation:

```siddhi
@App:name("SweetFactoryApp")
```

## Define the input stream and attach the CDC source

1. Define the stream that receives the input data:

    ```siddhi
    define stream InsertSweetProductionStream (name string,amount double);
    ```

2. Prepend a `@source` annotation of type `cdc` to the stream definition so that inserts from the `production` database are captured into this stream:

    ```siddhi
    @source(type='cdc',url = "jdbc:mysql://localhost:3306/production",username = "wso2si",password = "wso2",table.name = "SweetProductionTable",operation = "insert",
        @map(type='keyvalue'))
    ```

    The complete stream definition now looks like:

    ```siddhi
    @source(type='cdc',url = "jdbc:mysql://localhost:3306/production",username = "wso2si",password = "wso2",table.name = "SweetProductionTable",operation = "insert",
        @map(type='keyvalue'))
    define stream InsertSweetProductionStream (name string,amount double);
    ```

## Define the output stream and attach the file sink

1. Define an output stream for the captured data:

    ```siddhi
    define stream ProductionUpdatesStream (name string,amount double);
    ```

2. Prepend a `@sink` annotation of type `file` so the events are published to `<YOUR_HOME>/productioninserts.csv` in CSV format:

    ```siddhi
    @sink(type='file',file.uri = "<YOUR_HOME>/productioninserts.csv",
        @map(type='csv'))
    ```

    The complete stream definition now looks like:

    ```siddhi
    @sink(type='file',file.uri = "<YOUR_HOME>/productioninserts.csv",
        @map(type='csv'))
    define stream ProductionUpdatesStream (name string,amount double);
    ```

## Add the processing query

Write a query that reads from the input stream, converts the product name from lower case to upper case, and inserts the converted events into the output stream:

```siddhi
@info(name='query1')
from InsertSweetProductionStream
select str:upper(name) as name, amount
group by name
insert  into ProductionUpdatesStream;
```

This query gets the information inserted into the `production` database table from the `InsertSweetProductionStream` stream. The `str:upper()` function included in the `select` clause converts the product name from lower case to upper case. Once this conversion is done, the converted events are directed to the `ProductionUpdatesStream` stream. These events are written into the `<YOUR_HOME>/productioninserts.csv` file because it is configured via the `@sink` annotation you previously attached to the `ProductionUpdatesStream` stream.

## Save the Siddhi application

Save your changes.

The completed Siddhi application looks as follows:

```siddhi
@App:name('SweetFactoryApp')

@source(type='cdc',url = "jdbc:mysql://localhost:3306/production",username = "wso2si",password = "wso2",table.name = "SweetProductionTable",operation = "insert",
    @map(type='keyvalue'))
define stream InsertSweetProductionStream (name string,amount double);

@sink(type='file',file.uri = "<YOUR_HOME>/productioninserts.csv",
    @map(type='csv'))
define stream ProductionUpdatesStream (name string,amount double);

@info(name='query1')
from InsertSweetProductionStream
select str:upper(name) as name, amount
group by name
insert  into ProductionUpdatesStream;
```

## Installing the required extensions

WSO2 Integrator: SI is shipped with most of the available Siddhi extensions by default. If a Siddhi extension you require is not shipped by default, you can download and install it via the **Extension Installer** panel. The `SweetFactoryApp` Siddhi application you created uses a source of the `cdc` type. The `cdc-mysql` extension that is required for this source is not shipped with WSO2 Integrator: SI by default. Therefore, let's install it as follows.

1. In WSO2 Integrator, open the command palette by pressing `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) and type `SI: Extension Installer`. Then select the **SI: Extension Installer** option.

    ![Extension Installer Dialog Box]({{base_path}}/images/quick-start-guide-101/extension-installer-dialog.png)

    Click **Install** for **Change Data Capture - MySQL**.

2. Reload WSO2 Integrator.

!!! tip "Alternative: install from the terminal"
    You can also install Siddhi extensions on the SI runtime directly from the terminal — useful for production setups that don't use WSO2 Integrator. From the `<SI_HOME>/bin` directory, run `./extension-installer.sh install cdc-mysql` (on Linux/macOS) or `extension-installer.bat install cdc-mysql` (on Windows). When the installation completes, restart the SI server.

## Testing the Siddhi application

To verify that the Siddhi queries you wrote work as expected, you can simulate events via the Event Simulator in WSO2 Integrator: SI before connecting the application to real database events. To do so, follow the steps below:

!!! note
    MySQL must be running before you start the test. The `cdc` source opens its connection to MySQL on application startup, so the application will fail to deploy if MySQL is not reachable — even though you are using the Event Simulator instead of inserting real records.

1. In WSO2 Integrator: SI, click the **Run** button. The application is deployed to the SI runtime, and the Event Simulator panel opens on the left.

    ![Run button]({{base_path}}/images/Testing-Siddhi-Applications/Run-Button.png)

    ![Event Simulation Panel]({{base_path}}/images/Testing-Siddhi-Applications/Single-Event-Simulation-Panel.png)

2.  Enter Information in the **Single Simulation** panel as described below.

    ![Simulate Single Event]({{base_path}}/images/quick-start-guide-101/simulate-single-event.png)

    1. In the **Siddhi App Name** field, select **SweetFactoryApp**.

    2. In the **Stream Name** field, select **InsertSweetProductionStream**.

    3. Under **Attributes**, enter values as follows:

        | **Attribute**       | **Value**           |
        |---------------------|---------------------|
        | **name (STRING)**   | `gingerbread`       |
        | **amount (DOUBLE)** | `100`               |

3. Click **Start and Send**.

4. Open the `<YOUR_HOME>/productioninserts.csv`. It should contain the following row.

    `GINGERBREAD,100.0`


!!! tip "What's Next?"
    Now you can deploy the `SweetFactoryApp` Siddhi application you created. To do this, proceed to [Step 3: Deploy the Siddhi Application](deploy-siddhi-application.md).
