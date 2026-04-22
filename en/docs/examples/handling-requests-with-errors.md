# Error Handling with Data Streams

## Introduction

In this tutorial, let's learn how you can handle streaming data that has errors (e.g., events that do not have values for certain attributes). WSO2 Integrator: SI allows you to log such events, direct them to a separate stream or store them in a data store. If these errors occur at the time of publishing (e.g., due to a connection error), SI also provides the option to wait and then resume to publish once the connection is stable again. For detailed information about different ways to handle errors, see the [Handling Errors guide](../guides/handling-errors.md).

In this scenario, you are handling erroneous events by directing them to a MySQL store.

!!! Tip "Before you begin:"
    In order to save streaming data with errors in a MySQL store, complete the following prerequisites.<br/>    
    - Start the SI server by navigating to the `<SI_HOME>/bin` directory and issuing one of the following commands as appropriate, based on your operating system:<br/>
        <br/>
          - For Windows: `streaming-integrator.bat`<br/>
        <br/>
          - For Linux/macOS:  `sh server.sh`<br/>
        <br/>
      The following log appears in the WSO2 Integrator: SI console once you have successfully started the server. <br/>
      <br/>
      `INFO {org.wso2.carbon.kernel.internal.CarbonStartupHandler} - WSO2 Streaming Integrator started in N.NNN sec`
      <br/>
    - You need to have access to a MySQL instance.<br/>
    
## Tutorial steps
      
### Step 1: Create the data store

Let's create the MySQL data store in which the events with errors can be saved. To do this, follow the steps below:

1. Download the MySQL JDBC driver (Connector/J 8.0.33 or later) from [the MySQL site](https://dev.mysql.com/downloads/connector/j/).

2. Unzip the archive.<br/>

3. Copy the `mysql-connector-j-8.0.33.jar` to the `<SI_HOME>/lib` directory.<br/>

4. Open the MySQL client as follows:

    `mysql -u <USERNAME> -p`
    
5. Create a new database named `siddhierrorstoredb` by issuing the following command in the MySQL console.

    ``mysql> create database siddhierrorstoredb;``
    
6. To switch to the new database, issue the following command.

    `mysql> use siddhierrorstoredb;`

### Step 2: Enable the error store

To enable the error store, open the `<SI_HOME>/conf/server/deployment.yaml` file. Locate the `error.store:` block (it ships disabled by default) and update it as follows:

```
error.store:
  enabled: true
  bufferSize: 1024
  dropWhenBufferFull: true
  errorStore: org.wso2.carbon.streaming.integrator.core.siddhi.error.handler.DBErrorStore
  config:
    datasource: SIDDHI_ERROR_STORE_DB
    table: SIDDHI_ERROR_STORE_TABLE
```

This configuration refers to a data source named `SIDDHI_ERROR_STORE_DB`. Define this data source as follows under `Data sources` in the same `<SI_HOME>/conf/server/deployment.yaml` file:

```
- name: SIDDHI_ERROR_STORE_DB
  description: The datasource used for Siddhi error handling feature
  jndiConfig:
    name: jdbc/SiddhiErrorStoreDB
  definition:
    type: RDBMS
    configuration:
      jdbcUrl: 'jdbc:mysql://localhost:3306/siddhierrorstoredb?useSSL=false'
      username: root
      password: password
      driverClassName: com.mysql.cj.jdbc.Driver
      minIdle: 5
      maxPoolSize: 50
      idleTimeout: 60000
      connectionTestQuery: SELECT 1
      validationTimeout: 30000
      isAutoCommit: false
```

### Step 3: Create and deploy the Siddhi application

To create and deploy a Siddhi application, follow the steps below:

1. Open the VSCode editor with **WSO2 Integrator: SI** extension installed.

2. Copy paste the following three Siddhi applications to three separate new files and save.
    ```
        @App:name("MappingErrorTest")
        
        @OnError(action='STORE')
        @source(type = 'http',
                 receiver.url='http://localhost:8006/productionStream',
                 basic.auth.enabled='false',
        	 @map(type='json', @attributes(name='name', amount='amount')))
        define stream ProductionStream(name string, amount double);
        
        @sink(type='log', prefix='Successful mapping: ')
        define stream LogStream(name string, amount double);
        
        from ProductionStream
        select *
        insert into LogStream;
    ```
    ```
       @App:name("SinkTransportErrorTest")
       
       @sink(type = 'http', on.error='STORE', blocking.io='true', 
             publisher.url = "http://localhost:8090/unavailableEndpoint", 
             method = "POST", @map(type = 'json'))
       define stream TestPublisherStream (name string, amount double);
       
       @source(type = 'http', receiver.url='http://localhost:8007/testUnavailableEP', 
               basic.auth.enabled='false', 
               @map(type='json', enclosing.element='$.event', 
                   @attributes(name='name', amount='amount')))
       define stream TestInput(name string, amount double);
       
       from TestInput#log('Sending to unavailableEndpoint: ')
       select name, amount
       insert into TestPublisherStream;
    ```
    ```
       @App:name("ReceiveAndCount")
       
       @App:description('Receive events via HTTP transport and view the output on the console')
       
       @source(type = 'http',
               receiver.url='http://localhost:8090/unavailableEndpoint',
               basic.auth.enabled='false',
               @map(type='json'))
       define stream SweetProductionStream (name string, amount double);
       
       @sink(type='log')
       define stream TotalCountStream (totalCount long);
       
       -- Count the incoming events
       @info(name='query1')
       from SweetProductionStream
       select count() as totalCount
       insert into TotalCountStream;
    ```

3. Deploy the `MappingErrorTest.siddhi` and `SinkTransportErrorTest.siddhi` applications by POSTing each Siddhi source to the SI server's REST API:

    !!!warning "Security notice"
        The `curl` examples throughout this tutorial use the default `admin:admin` credentials that ship with a fresh WSO2 Integrator: SI install. In production, replace these credentials with secure values (ideally via shell environment variables, e.g. `-u "$SI_USER:$SI_PASS"`) to avoid leaking secrets through shell history and process lists.

    ```
    curl -sk -u admin:admin -X POST -H "Content-Type: text/plain" \
      --data-binary @MappingErrorTest.siddhi \
      "https://localhost:9443/siddhi-apps"

    curl -sk -u admin:admin -X POST -H "Content-Type: text/plain" \
      --data-binary @SinkTransportErrorTest.siddhi \
      "https://localhost:9443/siddhi-apps"
    ```

    Each request returns HTTP 201. The application is fully active once the following log appears in the WSO2 Integrator: SI console for each Siddhi app:

    ```
    INFO {org.wso2.carbon.streaming.integrator.core.internal.StreamProcessorService} - Siddhi App <name> deployed successfully
    ```

    !!! Tip
        To check the port of your SI server, open the `<SI_HOME>/conf/server/deployment.yaml` file and search for `wso2.transport.http` → `Listener Configurations`. The port is under the listener whose ID is `msf4j-https` (default `9443`).


### Step 4: Verify the error store REST API is reachable

WSO2 Integrator: SI exposes an error store REST API that lets you view, replay, and discard captured error entries. The API is served by the SI server on its HTTPS admin port (default `9443`) under the base path `/error-handler/`. You will use this API in the next steps.

To verify the API is reachable, issue the following command:

```
curl -sk -u admin:admin "https://localhost:9443/error-handler/error-entries?siddhiApp=MappingErrorTest"
```

The response is a JSON array of error entries captured for the specified Siddhi application. Since no errors have been captured yet, the response is an empty array:

```
[]
```

!!! Tip
    - The `-k` flag accepts the self-signed certificate that the SI server ships with by default.
    - `-u admin:admin` authenticates with the default admin credentials. Change these if you have reconfigured your server.
    - To check the port of your SI server, open `<SI_HOME>/conf/server/deployment.yaml` and search for `wso2.transport.http` → `Listener Configurations`. The port is under the listener whose ID is `msf4j-https`.
        
### Step 5: Test the event mapping failing scenario

#### Step 5.1: Publish an event with a mapping error in MappingErrorTest Siddhi application

Send an event to the `ProductionStream` stream of the `MappingErrorTest` Siddhi application by issuing the following CURL command.

```
curl --location --request POST 'http://localhost:8006/productionStream' \
--header 'Content-Type: application/json' \
--data-raw '{
                "foo": "Cake",
                "amount": 20.12
            }'
```
The event causes an error referred to as `MappingFailedException`. This is because the `ProductionStream` expects an event in the following format which is specified via a custom mapping.
```
{
    "name": "Cake",
    "amount": 20.12
}
```

#### Step 5.2: Inspect and resolve the error via the error store REST API

To inspect the captured error and resolve it, follow the procedure below.

1. List the errors captured for the `MappingErrorTest` Siddhi application:

    ```
    curl -sk -u admin:admin "https://localhost:9443/error-handler/error-entries?siddhiApp=MappingErrorTest"
    ```

    The response is a JSON array containing the mapping error entry you just simulated. Note the `id` field — you will reference it in the next step.

    ```
    [
        {
            "id": 1,
            "timestamp": 1595574091411,
            "siddhiAppName": "MappingErrorTest",
            "streamName": "ProductionStream",
            "cause": "No results for path: $['name']",
            "errorOccurrence": "BEFORE_SOURCE_MAPPING",
            "eventType": "PAYLOAD_STRING",
            "errorType": "MAPPING"
        }
    ]
    ```

    !!! Tip
        Append `?descriptive=true` to the URL to include `eventAsBytes` (binary payload) and `stackTrace` in each entry.

2. To view full details of the entry, issue the following command (replace `1` with the actual `id`):

    ```
    curl -sk -u admin:admin "https://localhost:9443/error-handler/error-entries/1"
    ```

    The single-entry endpoint returns a wrapper object in the following shape:

    ```
    {
        "errorEntry": { ... same ErrorEntry fields, plus eventAsBytes and stackTrace ... },
        "modifiablePayloadString": "{\"foo\":\"Cake\",\"amount\":20.12}",
        "isPayloadModifiable": true
    }
    ```

    Keep this response body — you will need its exact shape (wrapper and all) to replay an entry in Step 6.3.

3. The incoming event was malformed — the fix is on the sender side, so the entry cannot be replayed as-is. Discard the erroneous entry:

    ```
    curl -sk -u admin:admin -X DELETE "https://localhost:9443/error-handler/error-entries/1"
    ```

    The server responds with HTTP 200 and an empty JSON body `{}` when the entry is discarded.

4. Send the event again, this time using the correct `name` attribute:

    ```
    curl --location --request POST 'http://localhost:8006/productionStream' \
    --header 'Content-Type: application/json' \
    --data-raw '{
                    "name": "Cake",
                    "amount": 20.12
                }'
    ```

    The event maps successfully, and the following is logged in the WSO2 Integrator: SI console:

    ```
    INFO {io.siddhi.core.stream.output.sink.LogSink} - Successful mapping:  : Event{timestamp=1595574091411, data=[Cake, 20.12], isExpired=false}
    ```
   
### Step 6: Test the event failing scenario at sink level

#### Step 6.1: Trigger an event flow that publishes an event to the SinkTransportErrorTest Siddhi application

Send an HTTP event to the `TestInput` stream of the `SinkTransportErrorTest` Siddhi application by issuing the following CURL command.

```
curl --location --request POST 'http://localhost:8007/testUnavailableEP' --header 'Content-Type: application/json' --data-raw ' { "event": { "name": "Cake2", "amount": 20.222 } }'
```

The following is logged in the WSO2 Integrator: SI Server console
```
INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - SinkTransportErrorTest: Sending to unavailableEndpoint: , StreamEvent{ timestamp=1597853565942, beforeWindowData=null, onAfterWindowData=null, outputData=[Cake2, 20.222], type=CURRENT, next=null}
```
However, because the `http://localhost:8090/unavailableEndpoint` that the `SinkTransportErrorTest` sink publishes to is unavailable, the event is dropped at the sink level and then stored in the error store.

#### Step 6.2: Start service via the ReceiveAndCount Siddhi application

In this step, let's start the service at `http://localhost:8090/unavailableEndpoint` via the `ReceiveAndCount` Siddhi application by deploying it to the SI server:

```
curl -sk -u admin:admin -X POST -H "Content-Type: text/plain" \
  --data-binary @ReceiveAndCount.siddhi \
  "https://localhost:9443/siddhi-apps"
```

The following log is displayed in the WSO2 Integrator: SI console.

```
INFO {org.wso2.carbon.streaming.integrator.core.internal.StreamProcessorService} - Siddhi App ReceiveAndCount deployed successfully
```
#### Step 6.3: Inspect and replay the error via the error store REST API

To inspect the captured error and replay it now that the downstream service is available, follow the procedure below.

1. List the errors captured for the `SinkTransportErrorTest` Siddhi application:

    ```
    curl -sk -u admin:admin "https://localhost:9443/error-handler/error-entries?siddhiApp=SinkTransportErrorTest"
    ```

    The response is a JSON array containing the error entry that was stored when the sink could not reach `http://localhost:8090/unavailableEndpoint`. Note the `id` of the entry — you need it for the replay.

2. Fetch the full details of the entry — you will need the exact response body (wrapper and all) for the replay in the next step. Save it to a file:

    ```
    ID=1
    curl -sk -u admin:admin "https://localhost:9443/error-handler/error-entries/$ID" > entry.json
    ```

    Replace `1` with the actual `id` from the previous response. The single-entry endpoint returns a wrapper object with `errorEntry`, `modifiablePayloadString`, and `isPayloadModifiable` fields (same shape described in Step 5.2).

3. Replay the stored entry by POSTing a JSON array that contains the wrapper object you just fetched. Wrap the saved response in `[ ... ]` and POST it to the `/error-handler` endpoint:

    ```
    printf '[%s]' "$(cat entry.json)" > replay.json

    curl -sk -u admin:admin -X POST \
      -H "Content-Type: application/json" \
      --data-binary @replay.json \
      "https://localhost:9443/error-handler"
    ```

    The server responds with HTTP 200 and an empty JSON body `{}`. The `ReceiveAndCount` Siddhi application you deployed in Step 6.2 receives the replayed event, and the following is logged for the WSO2 Integrator: SI server:

    ```
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveAndCount : TotalCountStream : Event{timestamp=1597857170244, data=[1], isExpired=false}    
    ```