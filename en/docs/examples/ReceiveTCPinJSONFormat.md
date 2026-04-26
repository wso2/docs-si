# Receiving JSON Events via TCP

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to receive events to the `SweetProductionStream` via `TCP` transport in `JSON` format using default mapping and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites

- Install the `tcp` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A TCP client capable of producing events in the `siddhi-io-tcp` wire format. For the framing details, see the [siddhi-io-tcp documentation](https://siddhi-io.github.io/siddhi-io-tcp/api/latest/).

## Try it out

1. Start the Siddhi application by clicking **Run**. The following messages appear in the console:

    ```bash
    Tcp Server started in 0.0.0.0:9892
    ReceiveTCPinJSONFormat - Started Successfully!
    ```

    !!! tip "Port already in use?"
        If `Tcp Server started in 0.0.0.0:9892` does not appear, the port `9892` may already be in use by another program. Stop the application, change the port in the source configuration to an unused one, and start it again.

2. Send JSON-encoded sweet production events to `tcp://localhost:9892` with context `SweetProductionStream` using your TCP client. Each event payload should be in the form:

    ```json
    {"event":{"name":"<name>","amount":<amount>}}
    ```

3. The console logs the received events. A sample output looks like the following:

    ```bash
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049050858, data=[Gingerbread, 6664.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049051858, data=[Cream Sandwich, 6190.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049052859, data=[Gingerbread, 9725.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049053859, data=[Donut, 7777.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049054860, data=[Honeycomb, 8818.0], isExpired=false}
    ```

## Siddhi application

```sql
@App:name("ReceiveTCPinJSONFormat")
@App:description('Receive events via TCP transport in JSON format with default mapping and view the output on the console.')

@Source(type = 'tcp',
        context='SweetProductionStream',
        @map(type='json'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProductionAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
