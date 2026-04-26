# Publishing Binary Events via TCP

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to send sweet production events via TCP transport in binary format, and view the output in your TCP server's console.

## Prerequisites

- Install the `tcp` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A TCP server capable of accepting connections in the `siddhi-io-tcp` wire format and decoding events. For the framing details, see the [siddhi-io-tcp documentation](https://siddhi-io.github.io/siddhi-io-tcp/api/latest/).

## Try it out

1. Start your TCP server, listening on port `9892` and accepting events for context `LowProductionAlertStream`.

2. Start the Siddhi application by clicking **Run**. The following messages appear in the console:

    * `PublishTcpInBinaryFormat.siddhi - Started Successfully!`
    * `'tcp' sink at 'LowProductionAlertStream' stream successfully connected to 'localhost:9892'.`

    !!! tip "Connection error?"
        If you see `'LowProductionAlertStream' stream could not connect to 'localhost:9892'`, your TCP server may not be running, or the port may be in use by another program. Verify your TCP server is listening on `9892`, or change the port in both the sink configuration and your server.

3. Send events using the Event Simulator. For instructions, see [Testing Siddhi Applications](../develop/testing-a-Siddhi-Application.md). Use the following values:

    | **Field**          | **Value**              |
    |--------------------|------------------------|
    | **Siddhi App Name**| `PublishTcpInBinaryFormat` |
    | **Stream Name**    | `SweetProductionStream` |
    | **name**           | `toffee`                |
    | **amount**         | `45.24`                 |

    Send a few more events with different values.

4. Your TCP server receives the binary-encoded events. Sample output (formatting depends on your server implementation):

    ```bash
    Event{timestamp=1512446413468, data=[toffee, 45.25], isExpired=false}
    Event{timestamp=1512446425113, data=[coffee, 9.78], isExpired=false}
    Event{timestamp=1512446442300, data=[chocolate, 78.23], isExpired=false}
    ```

## Siddhi application

```sql
@App:name("PublishTcpInBinaryFormat")
@App:description('Send events via TCP transport using binary format')

define stream SweetProductionStream (name string, amount double);

@sink(type='tcp', url='tcp://localhost:9892/LowProductionAlertStream',
    @map(type='binary'))
define stream LowProductionAlertStream (name string, amount double);

from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
