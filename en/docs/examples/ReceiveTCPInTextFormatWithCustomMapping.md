# Receiving Custom Text Events via TCP

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to receive events to the `SweetProductionStream` via TCP transport in `text` format with custom regex mapping and log the events in `LowProductionAlertStream` to the output console.

## Prerequisites

- Install the `tcp` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A TCP client capable of producing events in the `siddhi-io-tcp` wire format with `text` mapping. For the framing details, see the [siddhi-io-tcp documentation](https://siddhi-io.github.io/siddhi-io-tcp/api/latest/).

## Try it out

1. Start the Siddhi application by clicking **Run**. The following messages appear in the console:

    ```bash
    Tcp Server started in 0.0.0.0:9892
    ReceiveTCPInTextFormatWithCustomMapping.siddhi - Started Successfully!
    ```

    !!! tip "Port already in use?"
        If `Tcp Server started in 0.0.0.0:9892` does not appear, the port `9892` may already be in use by another program. Stop the application, change the port in the source configuration to an unused one, and start it again.

2. Send sweet production events to `tcp://localhost:9892` with context `SweetProductionStream` using your TCP client. The Siddhi application uses the regex patterns defined in the `@map` annotation to extract the `name` and `amount` attributes — each payload should match the expected format (e.g., `id:Eclair 132`).

3. The console logs the received events. Sample output:

    ```bash
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971370311, data=["Eclair", 132.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971371299, data=["Ice", 6733.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971372300, data=["Lollipop", 742.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971373300, data=["Marshmallow", 8781.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971374301, data=["Marshmallow", 5105.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971375301, data=["Froyo", 5531.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971376301, data=["Gingerbread", 2193.0], isExpired=false}
    ```

## Siddhi application

```sql
@App:name("ReceiveTCPInTextFormatWithCustomMapping")
@App:description('Receive events via TCP transport in text format with custom mapping and view the output on the console.')

@Source(type = 'tcp', context='SweetProductionStream',
@map(type='text', fail.on.unknown.attribute = 'true', regex.A='((?<=id:)(.*)(?=))',regex.B='([-0-9]+)', @attributes(name ='A',amount= 'B')))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProductionAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
