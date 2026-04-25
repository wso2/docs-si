# Step 5: Update the Siddhi Application

A Siddhi application can be easily extended to consume messages from more sources, to carry out more processing activities for data, or to publish data to more destinations. For this example, consider a scenario where you also need to filter out the production data of eclairs and publish it to a Kafka topic so that applications that cannot read streaming data can have access to it. This involves extending the `SweetFactoryApp` Siddhi application to include Kafka in the streaming flow so that it functions as shown in the diagram below.

![Updated Siddhi Application]({{base_path}}/images/quick-start-guide-101/updated-siddhi-application.png)

To update the `SweetFactoryApp` Siddhi application so that it functions as described, follow the steps below.

## Edit the Siddhi application in WSO2 Integrator

1. Open the `SweetFactoryApp` Siddhi application you created in [Step 2: Create the Siddhi Application](create-the-siddhi-application.md) in WSO2 Integrator.

2. Define an input stream that reads each new row appended to the `<YOUR_HOME>/productioninserts.csv` file as an event. Prepend a `@source` annotation of type `file` in `LINE`/tailing mode:

    ```
    @source(type='file', mode='LINE',
       file.uri='file:<YOUR_HOME>/productioninserts.csv',
       tailing='true',
       @map(type='csv'))
    define stream FilterStream (name string, amount double);
    ```

    !!! tip
        Alternatively, you can write the query to read from one of the existing streams. However, in this example, let's create a new stream to understand how WSO2 Integrator: SI reads data from files.

3. Define an output stream that publishes filtered events to the `eclair-production` Kafka topic. Prepend a `@sink` annotation of type `kafka`:

    ```
    @sink(type = 'kafka', bootstrap.servers = "localhost:9092", topic = "eclair-production", is.binary.message = "false", partition.no = "0",
             @map(type = 'json'))
    define stream PublishFilteredDataStream (name string, amount double);
    ```

    The sink publishes every event it receives into the `eclair-production` topic in `json` format.

4. Add a query that filters eclair events from `FilterStream` and inserts them into `PublishFilteredDataStream`:

    ```
    from FilterStream [name=='ECLAIRS']
    select *
    group by name
    insert into PublishFilteredDataStream;
    ```

    The `[name=='ECLAIRS']` filter keeps only production runs for eclairs. These events are inserted into `PublishFilteredDataStream`, which publishes them to the `eclair-production` Kafka topic via its `@sink` annotation.

5. Save your changes.

    The completed Siddhi application looks as follows:

    ```
    @App:name('SweetFactoryApp')

    @source(type='cdc',url = "jdbc:mysql://localhost:3306/production",username = "wso2si",password = "wso2",table.name = "SweetProductionTable",operation = "insert",
        @map(type='keyvalue'))
    define stream InsertSweetProductionStream (name string, amount double);

    @source(type='file', mode='LINE',
       file.uri='file:<YOUR_HOME>/productioninserts.csv',
       tailing='true',
       @map(type='csv'))
    define stream FilterStream (name string, amount double);

    @sink(type='file',file.uri = "<YOUR_HOME>/productioninserts.csv",
        @map(type='csv'))
    define stream ProductionUpdatesStream (name string, amount double);

    @sink(type = 'kafka', bootstrap.servers = "localhost:9092", topic = "eclair-production", is.binary.message = "false", partition.no = "0",
             @map(type = 'json'))
    define stream PublishFilteredDataStream (name string, amount double);

    @info(name='query1')
    from InsertSweetProductionStream
    select str:upper(name) as name, amount
    group by name
    insert into ProductionUpdatesStream;

    from FilterStream [name=='ECLAIRS']
    select *
    group by name
    insert into PublishFilteredDataStream;
    ```

## Install the Kafka extension

The `kafka` extension is not shipped with WSO2 Integrator: SI by default, so it must be installed before the updated application (which uses a Kafka sink) can run.

1. In WSO2 Integrator, open the command palette by pressing `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) and type `SI: Extension Installer`. Then select the **SI: Extension Installer** option.

    In the **Extension Installer** panel, scroll to **Kafka** and click **Install**.

2. Reload WSO2 Integrator.

!!! tip "Alternative: install from the terminal"
    You can also install the Kafka extension on the SI runtime directly from the terminal — useful for production setups that don't use WSO2 Integrator. From the `<SI_HOME>/bin` directory, run `./extension-installer.sh install kafka` (on Linux/macOS) or `extension-installer.bat install kafka` (on Windows). When the installation completes, restart the SI server.

## Deploy the updated Siddhi application

Deploy the updated `SweetFactoryApp` Siddhi application to the SI runtime using the same method as in [Step 3: Deploy the Siddhi Application](deploy-siddhi-application.md) — by clicking **Run** in WSO2 Integrator (re-deploys automatically), or by copying the updated `SweetFactoryApp.siddhi` file into `<SI_HOME>/wso2/server/deployment/siddhi-files/` (overwriting the existing file).

When the deployment succeeds, a log line similar to the following is written to the SI server's logs:

```text
INFO {org.wso2.carbon.streaming.integrator.core.internal.StreamProcessorService} - Siddhi App SweetFactoryApp deployed successfully
```

## Verify the update

1. Insert records into the `production` database:

    ```sql
    insert into SweetProductionTable values('eclairs',100.0);
    insert into SweetProductionTable values('eclairs',60.0);
    insert into SweetProductionTable values('toffee',40.0);
    ```

2. From the `<KAFKA_HOME>` directory, consume messages from the `eclair-production` Kafka topic:

    ```sh
    bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic eclair-production --from-beginning
    ```

    You see the following messages in the Kafka consumer log:

    ```text
    {"event":{"name":"ECLAIRS","amount":100.0}}
    {"event":{"name":"ECLAIRS","amount":60.0}}
    ```

    The third record does not appear because the value for the `name` field is not `ECLAIRS`, so it is filtered out by the query.

!!! tip "What's Next?"
    To view the statistics generated by the `SweetFactoryApp` Siddhi application, proceed to [Step 6: Monitor Statistics](monitor-statistics.md).
