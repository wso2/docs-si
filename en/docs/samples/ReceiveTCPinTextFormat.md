## Purpose
This application demonstrates how to configure WSO2 Streaming Integrator Tooling to receive events to the `SweetProductionStream` via TCP transport in text default format and log the events in `LowProductionAlertStream` to the  output  console.

## Executing the sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.

    * `Tcp Server started in 0.0.0.0:9892`
    * `ReceiveTCPinTextFormat.siddhi - Started Successfully!`

## Testing the sample

Navigate to `<SI-Tooling-Home>/samples/sample-clients/tcp-client` and run `ant` command as follows:

```bash
ant -Dtype=text
```

If you want to publish custom number of events, you need to run `ant` command as follows.

```bash
ant -Dtype=text -DnoOfEventsToSend=5
```

## Notes

If you edit this application while it's running, stop the application -> Save -> Start.
If the message "Tcp Server started in 0.0.0.0:9892" does not appear,it could be due to the port 9892, defined in the Siddhi application is already being used by a different program. To resolve this issue, please do the following,

* Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop')
* Change the port 9892 to an unused port, in this Siddhi application's source configuration.
* Start the application and check whether the specified messages appear on the console.

## Viewing the results

See the output. Following messages would be shown on the console.

```bash
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990726372, data=[Eclair, 2171.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990727362, data=[Froyo, 1155.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990728363, data=[Gingerbread, 8840.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990729363, data=[Marshmallow, 7400.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinTextFormat : LowProductionAlertStream : Event{timestamp=1512990730364, data=[Cupcake, 889.0], isExpired=false}
```

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
