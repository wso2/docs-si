# Receiving XML Events via Websocket

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to receive events to the `SweetProductionStream` via WebSocket transport in XML default format and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites

- Install the `websocket` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A WebSocket client capable of sending text frames to the SI server. For details on the WebSocket source, see the [siddhi-io-websocket documentation](https://siddhi-io.github.io/siddhi-io-websocket/api/latest/).

## Try it out

1. Start the Siddhi application by clicking **Run**. The following message appears in the console:

    ```bash
    ReceiveWebSocketInXMLFormat.siddhi - Started Successfully!
    ```

2. Send sweet production events to `ws://localhost:8025/abc` using your WebSocket client. Each frame should contain an XML-encoded event matching the `SweetProductionStream` schema, for example:

    ```xml
    <events>
        <event>
            <name>Honeycomb</name>
            <amount>2700.35</amount>
        </event>
    </events>
    ```

3. The console logs the received events. Sample output:

    ```bash
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985540005, data=[Honeycomb, 2700.3555330804284], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985541009, data=[Froyo, 4195.429933118964], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985542006, data=[Donut, 9625.837679695496], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985543008, data=[Froyo, 1909.568113992198], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveWebSocketInXMLFormat : LowProductionAlertStream : Event{timestamp=1517985544012, data=[Lollipop, 291.8985351086241], isExpired=false}
    ```

## Siddhi application

```sql
@App:name("ReceiveWebSocketInXMLFormat")
@App:description('Receive events via WebSocket transport in XML format and view the output on the console.')

@Source(type = 'websocket', url='ws://localhost:8025/abc',
    @map(type='xml'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProductionAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
