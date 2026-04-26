# Receiving Text Events via TCP

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to receive events to the `SweetProductionStream` via TCP transport in `text` default format and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites

- Install the `tcp` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A TCP client capable of producing events in the `siddhi-io-tcp` wire format with `text` mapping. For the framing details, see the [siddhi-io-tcp documentation](https://siddhi-io.github.io/siddhi-io-tcp/api/latest/).

## Try it out

1. Start the Siddhi application by clicking **Run**. The following messages appear in the console:

    ```bash
    Tcp Server started in 0.0.0.0:9892
    ReceiveTCPinTextFormat.siddhi - Started Successfully!
    ```

    !!! tip "Port already in use?"
        If `Tcp Server started in 0.0.0.0:9892` does not appear, the port `9892` may already be in use by another program. Stop the application, change the port in the source configuration to an unused one, and start it again.

2. Send sweet production events to `tcp://localhost:9892` with context `SweetProductionStream` using your TCP client. Each event payload should be in the default text format expected by the `text` source mapper (`name:"<name>", amount:<amount>`).

3. The console logs the received events. Sample output:

    ```bash
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990726372, data=[Eclair, 2171.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990727362, data=[Froyo, 1155.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990728363, data=[Gingerbread, 8840.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990729363, data=[Marshmallow, 7400.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990730364, data=[Cupcake, 889.0], isExpired=false}
    ```

## Siddhi application

```sql
@App:name("ReceiveTCPinTextFormat")
@App:description('Receive events via TCP transport in text format with default mapping and view the output on the console.')


@Source(type = 'tcp', context='SweetProductionStream',
@map(type='text'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProductionAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
