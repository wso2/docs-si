
## Purpose

This application demonstrates how to use `siddhi-io-file` for receiving.

## Prerequisites

1. Edit this sample file by replacing `<SI-Tooling-Home>` with the absolute path of your WSO2SI Tooling home directory.
2. Save this sample.

## Executing the sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.

    ```bash
    ReceiveEventsFromFile.siddhi - Started Successfully!
    ```

3. Check the directories `<SI-Tooling-Home>/samples/artifacts/ReceiveEventsFromFile/files/consumed` and `new`.
4. All the files which were in the directory `new` should have been moved to `consumed` directory.

## Note

If the sample is not running and producing output, do the following first.

* Move all the files in `<SI-Tooling-Home>/samples/artifacts/ReceiveEventsFromFile/files/consumed` directory to `<SI-Tooling-Home>/samples/artifacts/ReceiveEventsFromFile/files/new`.
* Delete all the files in consumed and sink directories.

## Viewing the results

Processed output events will be logged in the console as follows:

```bash
INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - ReceiveEventsFromFile: event, StreamEvent{ timestamp=1513847875990, beforeWindowData=null, onAfterWindowData=null, outputData=[apache, 80.0, 2.0], type=CURRENT, next=null}
INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - ReceiveEventsFromFile: event, StreamEvent{ timestamp=1513847876004, beforeWindowData=null, onAfterWindowData=null, outputData=[cloudbees, 134.4, 2.0], type=CURRENT, next=null}
```

```sql
@App:name('ReceiveEventsFromFile')

@source(type='file', mode='text.full',
dir.uri='file:/<SI-Tooling-Home>/samples/artifacts/ReceiveEventsFromFile/files/new',
action.after.process='move',
tailing='false',
move.after.process='file:/<SI-Tooling-Home>/samples/artifacts/ReceiveEventsFromFile/files/consumed',
@map(type='json'))
define stream SweetProductionStream (name string, amount double);

from SweetProductionStream#window.time(1 min)
select name, sum(amount) as hourlyTotal, convert(time:extract('HOUR', time:currentTimestamp(), 'yyyy-MM-dd hh:mm:ss'), 'double') as currentHour
insert into LowProductionAlertStream;

from LowProductionAlertStream#log('event')
insert into LogStream;
```
