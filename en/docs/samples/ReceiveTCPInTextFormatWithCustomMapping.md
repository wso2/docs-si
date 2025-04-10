
## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator to receive events to the SweetProductionStream via TCP transport in Text default format and log the events in LowProductionAlertStream to the  output  console.

## Executing the sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.

    * `Tcp Server started in 0.0.0.0:9892`
    * `ReceiveTCPInTextFormatWithCustomMapping.siddhi - Started Successfully!`

## Testing the sample

Navigate to `<SI-Tooling-Home>/samples/sample-clients/tcp-client` and run `ant` command as follows:
Run `ant` command in the terminal as follows:

```bash
ant -Dtype=text -DcustomMapping=true
```

If you want to publish custom number of events, you need to run `ant` command as follows.

```bash
ant -Dtype=text -DcustomMapping=true -DnoOfEventsToSend=5
```

## Notes

If the message `Source Listener has created for url tcp://localhost:9892/SweetProductionStream` does not appear, it could be due to the port 9892, defined in the Siddhi application is already being used by a different program. To resolve this issue, please do the following.

* Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop').
* Change the port 9892 to an unused port, in this Siddhi application's source configuration.
* Start the application and check whether the specified messages appear on the console.

## Viewing the results

See the output. Following messages would be shown on the console continuousely.

```bash
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971370311, data=["Eclair", 132.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971371299, data=["Ice", 6733.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971372300, data=["Lollipop", 742.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971373300, data=["Marshmallow", 8781.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971374301, data=["Marshmallow", 5105.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971375301, data=["Froyo", 5531.0], isExpired=false}
INFO {io.siddhi.core.stream.output.sink.LogSink} - ReceiveTCPInTextFormatWithCustomMapping : LowProductionAlertStream : Event{timestamp=1512971376301, data=["Gingerbread", 2193.0], isExpired=false}
```

```sql
@App:name("ReceiveTCPInTextFormatWithCustomMapping")
@App:description('Receive events via TCP transport in text format with custom mapping and view the output on the console.')

@Source(type = 'tcp', context='SweetProductionStream',
@map(type='text', fail.on.unknown.attribute = 'true', regex.A='((?<=id:)(.*)(?=))',regex.B='([-0-9]+)', @attributes(name ='A',amount= 'B')))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProducitonAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
