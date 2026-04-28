# Receiving Binary Events via TCP

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to receive events to the `SweetProductionStream` via `TCP` transport in `binary` default format and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites

- Install the `tcp` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A TCP client capable of producing events in the `siddhi-io-tcp` wire format with `binary` mapping. For the framing details, see the [siddhi-io-tcp documentation](https://siddhi-io.github.io/siddhi-io-tcp/api/latest/).

## Try it out

1. Start the Siddhi application by clicking **Run**. The following messages appear in the console:

    ```bash
    Tcp Server started in 0.0.0.0:9892
    ReceiveTCPinBinaryFormat.siddhi - Started Successfully!
    ```

    !!! tip "Port already in use?"
        If `Tcp Server started in 0.0.0.0:9892` does not appear, the port `9892` may already be in use by another program. Stop the application, change the port in the source configuration to an unused one, and start it again.

2. Send sweet production events to `tcp://localhost:9892` with context `SweetProductionStream` using your TCP client. Each event must be in the binary format expected by the `binary` source mapper.

3. The console logs the received events. Sample output:

    ```bash
    [2017-12-11 15:55:12,682]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987912665, data=[Cupcake, 10.550546580727683], isExpired=false}
    [2017-12-11 15:55:13,671]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987913669, data=[Donut, 98.45360926759642], isExpired=false}
    [2017-12-11 15:55:14,672]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987914670, data=[Eclair, 48.77465755572478], isExpired=false}
    [2017-12-11 15:55:15,672]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987915671, data=[Froyo, 28.209321491656706], isExpired=false}
    [2017-12-11 15:55:16,673]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987916671, data=[Gingerbread, 110.46772110205492], isExpired=false}
    ```

## Siddhi application

```sql
@App:name("ReceiveTCPinBinaryFormat")
@App:description('Receive events via TCP transport in binary format with default mapping and view the output on the console.')

@Source(type = 'tcp', context='SweetProductionStream',
@map(type='binary'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProductionAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
