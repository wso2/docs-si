
## Purpose

This application demonstrates how to configure WSO2 Integrator: SI Tooling to send sweet production events via Kafka transport in Avro format with custom mapping.

## Prerequisites

1. Set up Kafka as follows:
    1. Create a folder called `kafka` and another folder called `kafka-osgi`.
    2. Copy the following files from `<Kafka-Home>/libs` to the `kafka` folder you just created:
        * kafka_2.11-0.10.0.0.jar
        * kafka-clients-0.10.0.0.jar
        * metrics-core-2.2.0.jar
        * scala-library-2.11.8.jar
        * zkclient-0.8.jar
        * zookeeper-3.4.6.jar
    3. Copy these same files to the `<SI-Tooling-Home>/samples/sample-clients/lib` folder.
    4. Navigate to `<SI-Tooling-Home>/bin` and issue the following command:
        * For Linux: `./jartobundle.sh <path/kafka> <path/kafka-osgi>`
        * For Windows: `./jartobundle.bat <path/kafka> <path/kafka-osgi>`

        If converted successfully, the following messages are shown on the terminal for each lib file:

        ```bash
        INFO: Created the OSGi bundle <kafka-lib-name>.jar for JAR file <absolute_path>/kafka/<kafka-lib-name>.jar
        ```

    5. Copy the OSGi-converted Kafka libraries from the `kafka-osgi` folder to `<SI-Tooling-Home>/lib`.

2. Save this sample.
3. If there are no syntax errors, the following message is shown on the console:
    * `Siddhi App PublishKafkaInAVroFormat successfully deployed.`

## Executing the Sample

1. Navigate to `<Kafka-Home>` and start the Zookeeper node using `bin/zookeeper-server-start.sh config/zookeeper.properties`
2. Navigate to `<Kafka-Home>` and start the Kafka server node using `bin/kafka-server-start config/server.properties`.
3. Navigate to `<ConfluentHome>` and start the Schema registry node using, `bin/schema-registry-start ./etc/schema-registry/schema-registry.properties`
4. Post the Avro schema to the schema registry using,

    ```bash
    curl -X POST -H "Content-Type: application/json" \
    --data '{
        "schema": "{
                        \"type\": \"record\",
                        \"name\": \"sweetProduction\", 
                        \"namespace\": \"sweetProduction\", 
                        \"fields\": [
                            {\"name\": \"Name\", \"type\": \"string\" },
                            {\"name\": \"Amount\", \"type\": \"double\"}
                        ]
                }"
            }' http://localhost:8081/subjects/sweet-production/versions
    ```

5. Navigate to `<SI-Tooling-Home>/samples/sample-clients/kafka-avro-consumer` and run the command `ant -Dtype=avro -DisBinaryMessage=true`
6. Start the Siddhi application by clicking on 'Run'.
7. If the Siddhi application starts successfully, the following messages are shown on the console:

    ```bash
    - PublishKafkaInCustomAvroFormat.siddhi - Started Successfully!
    - Kafka version : 0.10.0.0
    - Kafka commitId : 23c69d62a0cabf06
    - Kafka producer created.
    ```

## Testing the Sample

Send events through one or more of the following methods.

### Option 1 - Send events to the Kafka sink via the event simulator

1. Open the event simulator by clicking the second icon or pressing Ctrl+Shift+I.
2. In the Single Simulation tab of the panel, specify the values as follows:
    * `Siddhi App Name`  : `PublishKafkaInCustomAvroFormat`
    * `Stream Name`      : `SweetProductionStream`
3. In the `name` and `amount` fields, enter the following values and then click `Send` to send the event.
    * `name`: `chocolate cake`
    * `amount`: `50.50`
4. Send some more events.

### Option 2 - Publish events with Curl to the simulator HTTP endpoint

1. Open a new terminal and issue the following command:

    ```bash
    curl -X POST -d '{"streamName": "SweetProductionStream", "siddhiAppName": "PublishKafkaInCustomAvroFormat","data": ["chocolate cake", 50.50]}' http://localhost:9390/simulation/single -H 'content-type: text/plain'
    ```

2. If there is no error, the following messages are shown on the terminal:
    *  `{"status":"OK","message":"Single Event simulation started successfully"}`

### Option 3 - Publish events with Postman to the simulator HTTP endpoint

1. Launch the Postman application.
2. Make a 'Post' request to the `http://localhost:9390/simulation/single` endpoint. Set the `Content-Type` to `text/plain` and set the request body in text as follows:

    ```json
    {
        "streamName":"SweetProductionStream",
        "siddhiAppName":"PublishKafkaInCustomAvroFormat",
        "data":[
            "chocolate cake",
            50.50
        ]
    }
    ```

3. Click `Send`. If there is no error, the following messages are shown on the console:
    *  "status": "OK",
    *  "message": "Single Event simulation started successfully"

## Viewing the Results

See the output on the terminal of `<WSO2SIHome>/samples/sample-clients/kafka-avro-consumer`:

```bash
[java] [org.wso2.extension.siddhi.io.kafka.source.KafkaConsumerThread] : Event received in Kafka Event Adaptor with offSet: 0, key: null, topic: kafka_result_topic, partition: 0
[java] [io.siddhi.core.stream.output.sink.LogSink] : KafkaSample : logStream : Event{timestamp=1546973319457, data=[chocolate cake, 50.5], isExpired=false}
```

## Notes

If the message `'Kafka' sink at 'LowProductionAlertStream' has successfully connected to http://localhost:9092` does not appear, it could be that port 9092 defined in the Siddhi application is already being used by a different program. To resolve this issue, do the following,

1. Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop').
2. In this Siddhi application's source configuration, change port 9092 to an unused port.
3. Start the application and check whether the specified messages appear on the console.

```sql
@App:name("PublishKafkaInCustomAvroFormat")

@App:description('Send events via Kafka transport using Custom Avro format')

define stream SweetProductionStream (sweetName string, sweetAmount double);

@sink(type='kafka',
      topic='kafka_result_topic',
      is.binary.message='true',
      bootstrap.servers='localhost:9092',
      @map(type='avro',schema.def="""{"type":"record","name":"stock","namespace":"stock","fields":[{"name":"name","type":"string"},{"name":"amount","type":"double"}]}""",
      @payload("""{"name": "{{sweetName}}", "amount": {{sweetAmount}}}""")))
define stream LowProductionAlertStream (sweetName string, sweetAmount double);

@info(name='EventsPassthroughQuery')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
