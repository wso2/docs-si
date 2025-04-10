## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to receive events to the SweetProductionStream via TCP transport in binary default format and log the events in LowProductionAlertStream to the output console.

## Executing the sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.

    * `Tcp Server started in 0.0.0.0:9892`
    * `ReceiveTCPinBinaryFormat.siddhi - Started Successfully!`

## Testing the sample

Navigate to `<SI-Tooling-Home>/samples/sample-clients/tcp-client` and run `ant` command as follows:

Run `ant` command in the terminal as follows:

```bash
ant -Dtype=binary
```

If you want to publish custom number of events, you need to run `ant` command as follows:

```bash
ant -Dtype=binary -DnoOfEventsToSend=5
```

## Notes

If the message `Source Listener has created for url tcp://localhost:9892/SweetProductionStream` does not appear,it could be due to the port 9892, defined in the Siddhi application is already being used by a different program. To resolve this issue, please do the following.

* Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop').
* Change the port 9892 to an unused port, in this Siddhi application's source configuration.
* Start the application and check whether the specified messages appear on the console.

## Viewing the results

```bash
[2017-12-11 15:55:12,682]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987912665, data=[Cupcake, 10.550546580727683], isExpired=false}
[2017-12-11 15:55:13,671]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987913669, data=[Donut, 98.45360926759642], isExpired=false}
[2017-12-11 15:55:14,672]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987914670, data=[Eclair, 48.77465755572478], isExpired=false}
[2017-12-11 15:55:15,672]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987915671, data=[Froyo, 28.209321491656706], isExpired=false}
[2017-12-11 15:55:16,673]  INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinBinaryFormat : LowProductionAlertStream : Event{timestamp=1512987916671, data=[Gingerbread, 110.46772110205492], isExpired=false}
```

```sql
@App:name("ReceiveTCPinBinaryFormat")
@App:description('Receive events via TCP transport in binary format with default mapping and view the output on the console.')

@Source(type = 'tcp', context='SweetProductionStream',
@map(type='binary'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProducitonAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
