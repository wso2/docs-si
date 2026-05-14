# Publishing XML Events via WebSocket

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to send sweet production events via WebSocket transport in XML format, and view the output via your WebSocket client.

## Prerequisites

- Install the `websocket` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A WebSocket server (or a WebSocket client capable of accepting incoming frames) listening on the URL configured in the sink. For details on the WebSocket sink, see the [siddhi-io-websocket documentation](https://siddhi-io.github.io/siddhi-io-websocket/api/latest/).

## Try it out

1. Start your WebSocket endpoint, listening at `ws://localhost:8025/abc`.

2. Start the Siddhi application by clicking **Run**. The following message appears in the console:

    ```bash
    PublishWebSocketInXmlFormat.siddhi - Started Successfully!
    ```

    !!! tip "Connection error?"
        If you see `'LowProductionAlertStream' stream could not connect to 'localhost:8025'`, your WebSocket endpoint may not be running, or the port may be in use by another program. Verify your WebSocket server is listening on `8025`, or change the port in both the sink configuration and your server.

3. Send events using the Event Simulator. For instructions, see [Testing Siddhi Applications](../develop/testing-a-Siddhi-Application.md). Use the following values:

    | **Field**          | **Value**                      |
    |--------------------|--------------------------------|
    | **Siddhi App Name**| `PublishWebSocketInXmlFormat`  |
    | **Stream Name**    | `SweetProductionStream`        |
    | **name**           | `toffee`                       |
    | **amount**         | `45.24`                        |

    Send a few more events with different values.

4. Your WebSocket endpoint receives the XML-encoded events. Sample log output:

    ```bash
    Event{timestamp=1517982716368, data=[toffee, 45.25], isExpired=false}
    Event{timestamp=1517982792293, data=[coffee, 9.78], isExpired=false}
    Event{timestamp=1517982828856, data=[chocolate, 78.23], isExpired=false}
    ```

## Siddhi application

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
