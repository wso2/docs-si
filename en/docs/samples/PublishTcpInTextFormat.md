## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to send sweet production events via TCP transport in text format, and view the output on the server terminal.

## Executing the sample

1. Open a terminal and navigate to the `<SI-Tooling-Home>/samples/sample-clients/tcp-server` directory. Run the `ant -Dtype=text` command.
2. Start the Siddhi application by clicking 'Run'.
3. If the Siddhi application starts successfully, the following messages appear on the console.

    * `PublishTcpInTextFormat.siddhi - Started Successfully!`
    * `'tcp' sink at 'LowProductionAlertStream' stream successfully connected to 'localhost:9892'.`

4. Open event simulator by clicking on the second icon or press Ctrl+Shift+I.
5. In the Single Simulation tab of the panel, select values as follows:
    * `Siddhi App Name`: `PublishTcpInTextFormat`
    * `Stream Name`: `SweetProductionStream`
6. In the 'name' field and 'amount' field, enter 'toffee' and '45.24' respectively and click Send to send the event.
7. Send some more events.
8. See the output in the terminal of `<SI-Tooling-Home>/samples/sample-clients/tcp-server`. You can see output similar to the following:

    ```bash
    [java] [org.wso2.si.tcp.server.TCPServer] : Event{timestamp=1512446413468, data=[toffee, 45.25], isExpired=false}
    [java] [org.wso2.si.tcp.server.TCPServer] : Event{timestamp=1512446425113, data=[coffee, 9.78], isExpired=false}
    [java] [org.wso2.si.tcp.server.TCPServer] : Event{timestamp=1512446442300, data=[chocolate, 78.23], isExpired=false}
    ```

## Notes

If you need to edit this application while it is running, stop the application -> Save -> Start. If you see the message `'LowProductionAlertStream' stream could not connect to 'localhost:9892'`, it could be due to the port 9892, defined in the Siddhi application. This port is already being used by a different program. To resolve this issue, please do the following:

* Stop this Siddhi application (click 'Run' on menu bar -> 'Stop').
* Change the port 9893 to an unused port in this Siddhi application's source configuration and also change the port number in the tcp-server file.
* Start the application and check whether the expected output appears on the console.

```sql
@App:name("PublishTcpInTextFormat")
@App:description('Send events via TCP transport using text format')

define stream SweetProductionStream (name string, amount double);

@sink(type='tcp', url='tcp://localhost:9892/LowProductionAlertStream',
@map(type='text'))
        define stream LowProductionAlertStream (name string, amount double);

from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
