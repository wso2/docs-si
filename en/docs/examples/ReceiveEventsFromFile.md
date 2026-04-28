# Receiving Events via File

## Purpose

This application demonstrates how to use `siddhi-io-file` for receiving file-based events.

## Prerequisites

- Install the `file` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- Two directories that the Siddhi application can read from and write to. This example uses `<YOUR_HOME>/file-samples/new` (source) and `<YOUR_HOME>/file-samples/consumed` (destination).

## Try it out

1. Create the source and destination directories:

    ```bash
    mkdir -p <YOUR_HOME>/file-samples/new
    mkdir -p <YOUR_HOME>/file-samples/consumed
    ```

2. Edit the Siddhi application below by replacing `<YOUR_HOME>` with the absolute path of the parent directory you chose, and save it.

3. Start the Siddhi application by clicking **Run**. The following message appears in the console:

    ```bash
    ReceiveEventsFromFile.siddhi - Started Successfully!
    ```

4. Drop one or more JSON event files into `<YOUR_HOME>/file-samples/new`. Each file should contain a JSON event matching the `SweetProductionStream` schema, for example:

    ```json
    {"event":{"name":"apache","amount":80.0}}
    ```

5. The application reads each file, processes it, and moves it to `<YOUR_HOME>/file-samples/consumed`. Processed events are logged in the console:

    ```bash
    INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - ReceiveEventsFromFile: event, StreamEvent{ timestamp=1513847875990, beforeWindowData=null, onAfterWindowData=null, outputData=[apache, 80.0, 2.0], type=CURRENT, next=null}
    INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - ReceiveEventsFromFile: event, StreamEvent{ timestamp=1513847876004, beforeWindowData=null, onAfterWindowData=null, outputData=[cloudbees, 134.4, 2.0], type=CURRENT, next=null}
    ```

    !!! tip "Re-running the example"
        If you want to re-process the same files, move them back from the `consumed` directory to the `new` directory before re-running.

## Siddhi application

```sql
@App:name('ReceiveEventsFromFile')

@source(type='file', mode='text.full',
dir.uri='file:<YOUR_HOME>/file-samples/new',
action.after.process='move',
tailing='false',
move.after.process='file:<YOUR_HOME>/file-samples/consumed',
@map(type='json'))
define stream SweetProductionStream (name string, amount double);

from SweetProductionStream#window.time(1 min)
select name, sum(amount) as hourlyTotal, convert(time:extract('HOUR', time:currentTimestamp(), 'yyyy-MM-dd hh:mm:ss'), 'double') as currentHour
insert into LowProductionAlertStream;

from LowProductionAlertStream#log('event')
insert into LogStream;
```
