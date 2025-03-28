## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to receive events to the `SweetProductionStream` via Jms transport in Keyvalue and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites

1. Setup ActiveMQ
	* Download [activemq-client-5.x.x.jar](https://repo1.maven.org/maven2/org/apache/activemq/activemq-client/5.9.0/activemq-client-5.9.0.jar).
	* Download [apache-activemq-5.x.x-bin.zip](http://archive.apache.org/dist/activemq/apache-activemq/5.9.0/apache-activemq-5.9.0-bin.zip)
	* ActiveMQ `activemq-client-5.x.x.jar` should be added to `<SI-Tooling-Home>/lib` after being converted to OSGI (See Note: To convert ActiveMQ lib to OSGI).
	* Unzip the `apache-activemq-5.x.x-bin.zip` and copy the following ActiveMQ libs in `apache-activemq-5.x.x/lib` to `<SI-Tooling-Home>/samples/sample-clients/lib` and `<SI-Tooling-Home>/lib`.
		- hawtbuf-1.9.jar
		- geronimo-j2ee-management_1.1_spec-1.0.1.jar
		- geronimo-jms_1.1_spec-1.1.1.jar
2. Save this sample.
3. If there is no syntax error, the following message is shown on the console:

	```bash
	Siddhi App ReceiveJMSInKeyvalueFormat successfully deployed.
	```

## Note

To convert ActiveMQ lib to OSGI,

1. Navigate to <SI-Tooling-Home>/bin and run the following command:
	- For Linux:

	```bash
	./icf-provider.sh org.apache.activemq.jndi.ActiveMQInitialContextFactory <Downloaded Jar Path>/activemq-client-5.x.x.jar <Output Jar Path>
	```

	- For Windows:

	```bash
	./icf-provider.bat org.apache.activemq.jndi.ActiveMQInitialContextFactory <Downloaded Jar Path>\activemq-client-5.x.x.jar <Output Jar Path>
	```

	* Provide privileges if necessary using `chmod +x icf-provider.(sh|bat)`.
	* Also, this will register the `InitialContextFactory` implementation according to the OSGi JNDI spec.
2. If converted successfully then it will create `activemq-client-5.x.x` directory in the `<Output Jar Path>` with OSGi converted and original jars:
	- `activemq-client-5.x.x.jar` (Original Jar)
	- `activemq-client-5.x.x_1.0.0.jar` (OSGi converted Jar)

	Also, following messages would be shown on the terminal

	```bash
	- INFO: Executing 'jar uf <absolute_path>/activemq-client-5.x.x/activemq-client-5.x.x.jar -C <absolute_path>/activemq-client-5.x.x /internal/CustomBundleActivator.class'
	[timestamp] org.wso2.carbon.tools.spi.ICFProviderTool addBundleActivatorHeader
	- INFO: Running jar to bundle conversion [timestamp] org.wso2.carbon.tools.converter.utils.BundleGeneratorUtils convertFromJarToBundle
	- INFO: Created the OSGi bundle activemq_client_5.x.x_1.0.0.jar for JAR file <absolute_path>/activemq-client-5.x.x/activemq-client-5.x.x.jar
	```

3. You can find the osgi converted libs in `activemq-client-5.x.x` folder. You can copy `activemq-client-5.x.x/activemq-client-5.x.x_1.0.0.jar` to `<SI-Tooling-Home>/lib` and `activemq-client-5.x.x/activemq-client-5.x.x.jar` to `<SI-Tooling-Home>/samples/sample-clients/lib`.

## Executing the sample

1. Navigate to `{apache-activemq-5.x.x}` unzipped directory and start ActiveMQ server node using `bin/activemq start`.
2. Start the Siddhi application by clicking on 'Run'.
3. If the Siddhi application starts successfully, the following messages are shown on the console:

	```bash
	ReceiveJMSInKeyvalueFormat.siddhi - Started Successfully!
	```

## Testing the sample

Navigate to `<SI-Tooling-Home>/samples/sample-clients/jms-producer` and run the following command.

```bash
ant -Dtype='keyvalue'
```

## Viewing the results

Messages similar to the following would be shown on the editor console.

```bash
- INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveJMSInKeyvalueFormat : OutputStream : Event{timestamp=1513617090756, data=[Cream Sandwich, 790.7842348407036], isExpired=false}
```

```sql
@App:name('ReceiveJMSInKeyvalueFormat')
@App:description('Receive events via JMS provider in Keyvalue format with default mapping and view the output on the console.')

@source(type='jms',
        factory.initial='org.apache.activemq.jndi.ActiveMQInitialContextFactory',
        provider.url='tcp://localhost:61616',
        destination='jms_result_topic',
        connection.factory.type='topic',
        connection.factory.jndi.name='TopicConnectionFactory',
        @map(type='keyvalue'))
define stream SweetProductionStream(name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream(name string, amount double);

@info(name='EventsPassthroughQuery')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
