## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to send sweet production events via RabbitMQ transport in XML format, and view the output on the rabbitmq-consumer.

1. The following message appears on the console.

    ```bash
    Siddhi App PublishRabbitmqInXmlFormat successfully deployed.
    ```

2. Setting up RabbitMQ broker in Ubuntu Linux.
    1. To download and install RabbitMQ, run the following commands:

        ```bash
        sudo apt-get update
        sudo apt-get install rabbitmq-server
        ```

    2. To manage the maximum amount of connections upon launch, open and edit the following configuration file using a nano command:

        ```bash
        sudo nano /etc/default/rabbitmq-server
        ```

    3. To enable RabbitMQ Management Console, run the following command:

        ```bash
        sudo rabbitmq-plugins enable rabbitmq_management
        ```

    4. To start the service, issue the following command:

        ```bash
        invoke-rc.d rabbitmq-server start
        ```

## Executing the sample

1. Open a terminal and navigate to the `<SI-Tooling-Home>/samples/sample-clients/rabbitmq-consumer` directory and run the `ant` command.
    * If you use the default exchange `RABBITMQSAMPLE` and URI `amqp://guest:guest@localhost:5672` in your program use `ant` command without any arguments.
    * However, if you use different exchange names or URIs, run the `ant` command with appropriate arguments.
    e.g., `ant -Dexchange=rabbitMqtest`
2. Start the Siddhi application by clicking 'Run'.
3. If the Siddhi application starts successfully, the following messages appear on the console.

```bash
PublishRabbitmqInXmlFormat.siddhi - Started Successfully!
```

## Testing the sample

1. Open the event simulator by clicking the second icon or pressing Ctrl+Shift+I.
2. In the Single Simulation tab of the panel, select values as follows:
    * `Siddhi App Name`: `PublishRabbitmqInXmlFormat`
    * `Stream Name`: `SweetProductiontream`
3. In the `name` field and `amount` fields, enter 'toffee' and '45.24' respectively and then click Send to send the event.
4. Send some more events.

## Viewing the results

* See the output in the terminal of `<SI-Tooling-Home>/samples/sample-clients/rabbitmq-consumer`. You will get the output as follows (sample output for 4 events):

```bash
[java] [org.apache.axiom.om.util.StAXUtils] : XMLStreamReader is org.apache.axiom.util.stax.dialect.SJSXPStreamReaderWrapper
[java] [io.siddhi.core.stream.output.sink.LogSink] : PublishRabbitmqInXmlFormatTest : logStream : Event{timestamp=1512448790922, data=[toffee, 9.78], isExpired=false}
[java] [org.apache.axiom.om.util.StAXUtils] : XMLStreamReader is org.apache.axiom.util.stax.dialect.SJSXPStreamReaderWrapper
[java] [io.siddhi.core.stream.output.sink.LogSink] : PublishRabbitmqInXmlFormatTest : logStream : Event{timestamp=1512448813975, data=[lollipop, 12.6], isExpired=false}
[java] [org.apache.axiom.om.util.StAXUtils] : XMLStreamReader is org.apache.axiom.util.stax.dialect.SJSXPStreamReaderWrapper
[java] [io.siddhi.core.stream.output.sink.LogSink] : PublishRabbitmqInXmlFormatTest : logStream : Event{timestamp=1512448830488, data=[Pop, 72.6], isExpired=false}
```

## Notes

If you need to edit this application while it is running, stop the application -> Save -> Start.
If the message `'LowProducitonAlertStream' stream could not connect to 'localhost:5672'`, it could be due to the port 5672, which is defined in the Siddhi application. This port is already being used by a different program. To resolve this issue, please do the following,

* Stop this Siddhi application (click 'Run' on menu bar -> 'Stop').
* Change the port 5672 to an unused port.
* Start the application and check whether the expected output appears on the console.
RabbitMq consumer was written according to this example (go through the RabbitMQReceiver application).

```sql
@App:name("PublishRabbitmqInXmlFormat")
@APP:description("demonstrates how to configure WSO2 Streaming Integrator Tooling to send sweet production events via RabbitMQ transport in XML format, and view the output on the rabbitmq-consumer")

define stream SweetProductionStream (name string, amount double);

@sink(type ='rabbitmq', uri = 'amqp://guest:guest@localhost:5672', exchange.name = 'RABBITMQSAMPLE',
    @map(type='xml'))
define stream LowProducitonAlertStream (name string, amount double);

from SweetProductionStream
select *
insert into LowProducitonAlertStream;
```
