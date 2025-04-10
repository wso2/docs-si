## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator to receive events to the `SweetProductionStream` via `TCP` transport in `JSON` format using default mapping and log the events in `LowProductionAlertStream` to the output console.

## Executing the sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.

    * `Tcp Server started in 0.0.0.0:9892`
    * `ReceiveTCPinJSONFormat - Started Successfully!`

## Testing the sample

Navigate to `<SI-Tooling-Home>/samples/sample-clients/tcp-client` and run `ant` command as follows:

```bash
ant -Dtype=application/json
```

If you want to publish custom number of events, you need to run `ant` command as follows.

```bash
ant -Dtype=application/json -DnoOfEventsToSend=5
```

## Notes

If the message `Tcp Server started in 0.0.0.0:9892` does not appear, it could be due to the port 9892, defined in the Siddhi application is already being used by a different program. To resolve this issue, please do the following,

* Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop').
* Change the port 9892 to an unused port, in this Siddhi application's source configuration.
* Start the application and check whether the specified messages appear on the console.

## Viewing the results

See the output. Following messages would be shown on the console.

```bash
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049050858, data=[Gingerbread, 6664.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049051858, data=[Cream Sandwich, 6190.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049052859, data=[Gingerbread, 9725.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049053859, data=[Donut, 7777.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPinJSONFormat : LowProductionAlertStream : Event{timestamp=1513049054860, data=[Honeycomb, 8818.0], isExpired=false}
```

```sql
@App:name("ReceiveTCPinJSONFormat")
@App:description('Receive events via TCP transport in JSON format with default mapping and view the output on the console.')

@Source(type = 'tcp',
        context='SweetProductionStream',
        @map(type='json'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProducitonAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
