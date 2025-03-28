## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to send sweet production events via WebSocket transport in XML default format and log the events in `LowProductionAlertStream` to the output console.

 If there is no syntax error, the following message is shown on the console:

```bash
Siddhi App PublishWebSocketInXmlFormat successfully deployed.
```

## Executing the sample

1. Open a terminal and navigate to the `<SI-Tooling-Home>/samples/sample-clients/websocket-receiver` directory and run the `ant` command.
	* If you use the default host 'localhost' and port '8025' in your program use `ant` command without any arguments.
	* However, if you use different host or port, run the `ant` command with appropriate arguments.
	e.g., `ant -Dport=9025`
2. Start the Siddhi application by clicking on 'Run'.
3. If the Siddhi application starts successfully, the following messages are shown on the console:

	```bash
	PublishWebSocketInXmlFormat.siddhi - Started Successfully!
	```

4. Open the event simulator by clicking on the second icon or press Ctrl+Shift+I.
5. In the Single Simulation tab of the panel, select values as follows:
	* `Siddhi App Name`: PublishWebSocketInXmlFormat
	* `Stream Name`: `SweetProductionStream`
6. In the 'name' and 'amount' fields, enter 'toffee' and '45.24' respectively, and then click Send to send the event.
7. Send some more events.
8. Check the output in the terminal of `<SI-Tooling-Home>/samples/sample-clients/websocket-receiver`. You will see output similar to the following:

```bash
WebSocketSample : logStream : Event{timestamp=1517982716368, data=[toffee, 45.25], isExpired=false}
WebSocketSample : logStream : Event{timestamp=1517982792293, data=[coffee, 9.78], isExpired=false}
WebSocketSample : logStream : Event{timestamp=1517982828856, data=[chocolate, 78.23], isExpired=false}
```

## Viewing the results

See the output on the terminal.

## Notes

If the message `'LowProductionAlertStream' stream could not connect to 'localhost:8025'`, it could be due to the port 8025 defined in the Siddhi application is already being used by a different program. To resolve this issue, do the following:
1. Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop').
2. Change the port from 8025 to an unused port in this Siddhi application's source configuration and in the websocket-receiver file.
3. Start the application and check whether the expected output appears on the console.

```sql
@App:name("PublishWebSocketInXmlFormat")
@App:description('Send events via WebSocket transport using XML format')

define stream SweetProductionStream (name string, amount double);

@sink(type='websocket', url='ws://localhost:8025/abc',
@map(type='xml'))
define stream LowProductionAlertStream (name string, amount double);

@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
