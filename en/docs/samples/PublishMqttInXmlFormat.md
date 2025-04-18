## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to send sweet production events via MQTT transport in XML format and view the output on the mqtt-consumer.

## Prerequisites

1. Save this sample. The following message appears on the console.

    ```bash
    Siddhi App PublishMqttInXmlFormat successfully deployed.
    ```

2. Setting up MQTT Mosquitto broker in Ubuntu Linux.
    1. Add the `mosquitto` repository using the following commands.

        ```bash
        sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
        sudo apt-get update
        ```

    2. Execute the following command to install the `Mosquitto` broker package.

        ```bash
        sudo apt-get install mosquitto
        ```

    3. Install `Mosquitto` developer libraries to develop MQTT clients.

        ```bash
        sudo apt-get install libmosquitto-dev
        ```

    4. Execute the following command to install `Mosquitto` client packages.

        ```bash
        sudo apt-get install mosquitto-clients
        ```

    5. Ensure that the `Mosquitto` broker is running.

        ```bash
        sudo service mosquitto status
        ```

## Executing the Sample

1. Open a terminal, navigate to the `{SI-Tooling-Home}/samples/sample-clients/mqtt-consumer` directory, and run the `ant` command.
    * If you use the default topic `mqtt_topic` and URL `tcp://localhost:1883`, in your program use the `ant` command without any arguments.
    * However, if you use a different topic, run the `ant` command with appropriate argument.
    e.g. `ant -Dtopic=mqttTest`
2. Start the Siddhi application by clicking 'Run'.
3. If the Siddhi application starts successfully, the following messages appear on the console

    ```bash
    PublishMqttInXmlFormat.siddhi - Started Successfully!
    ```

## Testing the Sample

1. Open the event simulator by clicking on the second icon or press Ctrl+Shift+I.
2. In the Single Simulation tab of the panel, select values as follows:
    * `Siddhi App Name`: `PublishMqttInXmlFormat`
    * `Stream Name`: `SweetProductionStream`
3. In the `name` field and `amount` fields, enter 'toffee' and '45.24' respectively. Then click Send to send the event.
4. Send some more events.

## Viewing the Results

See the output in the terminal of `{SI-Tooling-Home}/samples/sample-clients/mqtt-consumer`. You will get the output as follows (example for 3 events):

```bash
[java] [org.apache.axiom.om.util.StAXUtils] : XMLStreamReader is org.apache.axiom.util.stax.dialect.SJSXPStreamReaderWrapper
[java] [io.siddhi.core.stream.output.sink.LogSink] : PublishMqttInXmlFormatTest : logStream : Event{timestamp=1512462478777, data=[chocolate, 78.34], isExpired=false}
[java] [org.apache.axiom.om.util.StAXUtils] : XMLStreamReader is org.apache.axiom.util.stax.dialect.SJSXPStreamReaderWrapper
[java] [io.siddhi.core.stream.output.sink.LogSink] : PublishMqttInXmlFormatTest : logStream : Event{timestamp=1512462520264, data=[sweets, 34.57], isExpired=false}
[java] [org.apache.axiom.om.util.StAXUtils] : XMLStreamReader is org.apache.axiom.util.stax.dialect.SJSXPStreamReaderWrapper
[java] [io.siddhi.core.stream.output.sink.LogSink] : PublishMqttInXmlFormatTest : logStream : Event{timestamp=1512462534053, data=[coffee, 12.7], isExpired=false}
```

## Notes

If you need to edit this application while it is running, stop the application, `Save` -> `Start`.

If the message `"LowProductionAlertStream' stream could not connect to 'localhost:1883"` is logged, it could be due to port 1883, which is defined in the Siddhi application. This port is already being used by a different program. To resolve this issue, please do the following:

* Stop this Siddhi application (click 'Run' on the menu bar -> 'Stop').
* Change the port 1883 to an unused port. To do this you need to add a new listener in mosquitto.conf (e.g., listener port 1884,listener port 1885).
* Start the application and check whether the expected output appears on the console.

```sql
@App:name("PublishMqttInXmlFormat")
define stream SweetProductionStream (name string, amount double);

@sink(type='mqtt', url= 'tcp://localhost:1883',topic='mqtt_topic',
    @map(type='xml'))
define stream LowProductionAlertStream (name string, amount double);

from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
