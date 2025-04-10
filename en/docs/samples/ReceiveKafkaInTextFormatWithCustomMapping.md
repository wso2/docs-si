## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator to receive events to the `SweetProductionStream` via Kafka transport in Text format using custom mapping and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites

1. Setup Kafka.
	* Kafka libs to be added and converted to OSGI from `{KafkaHome}/libs` are as follows.
		* kafka_2.11-0.10.0.0.jar
		* kafka-clients-0.10.0.0.jar
		* metrics-core-2.2.0.jar
		* scala-library-2.11.8.jar
		* zkclient-0.8.jar
		* zookeeper-3.4.6.jar
	*  Add the OSGI converted kafka libs to `<SI-Tooling-Home>/lib`.
	*  Add the kafka libs to `<SI-Tooling-Home>/samples/sample-clients/lib`.
2. Save this sample.
3. If there is no syntax error, the following message is shown on the console:

	```bash
	* Siddhi App PublishKafkaInJsonFormat successfully deployed.
	```

## Note

To convert Kafka libs to OSGI,

1. Create a folder (eg: kafka) and copy Kafka libs to be added from `{KafkaHome}/libs`.
2. Create another folder (eg: kafka-osgi, This folder will have the libs that converted to OSGI).
3. Navigate to `<SI-Tooling-Home>/bin` and issue the following command.
	- For Linux:

	```bash
	./jartobundle.sh <path/kafka> <path/kafka-osgi>
	```

	- For Windows:

	```bash
	./jartobundle.bat <path/kafka> <path/kafka-osgi>
	```

4. If converted successfully then for each lib, following messages would be shown on the terminal.

    ```bash
    - INFO: Created the OSGi bundle <kafka-lib-name>.jar for JAR file <absolute_path>/kafka/<kafka-lib-name>.jar
    ```

5. You can find the osgi converted libs in kafka-osgi folder. You can copy that to `<SI-Tooling-Home>/lib`.

## Executing the sample

1. Navigate to `{KafkaHome}` and start zookeeper node using the `bin/zookeeper-server-start.sh config/zookeeper.properties`.
2. Navigate to `{KafkaHome}` and start kafka server node using `bin/kafka-server-start.sh config/server.properties`.
3. Start the Siddhi application by clicking on 'Run'.
4. If the Siddhi application starts successfully, the following messages are shown on the console:

	```bash
	- ReceiveKafkaInTextFormatWithCustomMapping.siddhi - Started Successfully!
	- Kafka version : 0.10.0.0
	- Kafka commitId : b8642491e78c5a13
	- Adding partition 0 for topic: kafka_sample_topic
	- Adding partitions [0] for topic: kafka_sample_topic
	- Subscribed for topics: [kafka_sample_topic]
	- Kafka Consumer thread starting to listen on topic/s: [kafka_sample_topic] with partition/s: [0]
	- Discovered coordinator 10.100.7.56:9092 (id: 2147483647 rack: null) for group group
	```

## Testing the sample

Navigate to `<SI-Tooling-Home>/samples/sample-clients/kafka-producer` and run `ant` command as follows:

```bash
ant -Dtype=text -DcustomMapping=true
```

## Viewing the results

Messages similar to the following would be shown on the console.

```bash
- INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveKafkaInTextFormatWithCustomMapping: LowProductionAlertStream : Event{timestamp=1513282182570, data=["Cupcake", 1665.0], isExpired=false}
```

## Note

* Stop this Siddhi application, once you are done with the execution.
* Stop Kafka server and Zookeeper server individually by executing Ctrl+C.

```sql
@App:name("ReceiveKafkaInTextFormatWithCustomMapping")
@App:description('Receive events via Kafka transport in Text format with custom mapping and view the output on the console')

@source(type='kafka',
        topic.list='kafka_sample_topic',
        partition.no.list='0',
        threading.option='single.thread',
        group.id="group",
        bootstrap.servers='localhost:9092',
 @map(type='text',fail.on.missing.attribute='true', regex.A='(id):(.*)', regex.B='(amount):([-.0-9]+)',
                @attributes(id = 'A[2]', amount = 'B[2]')))
define stream SweetProductionStream(id string, amount double);

@sink(type='log')
define stream LowProductionAlertStream(id string, amount double);

@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
