# Publishing XML Events via RabbitMQ

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI to send sweet production events via RabbitMQ transport in XML format, and view the output via your AMQP consumer.

## Prerequisites

- Install the `rabbitmq` Siddhi extension. For instructions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).
- A running RabbitMQ broker. For installation instructions, see the [RabbitMQ download page](https://www.rabbitmq.com/download.html).
- An AMQP 0-9-1 consumer to verify the output, e.g., the [RabbitMQ Management plugin](https://www.rabbitmq.com/management.html), the `rabbitmqadmin` CLI, or any AMQP client library.

## Try it out

1. Make sure your RabbitMQ broker is running and reachable at `amqp://guest:guest@localhost:5672`.

2. Start consuming messages from the `RABBITMQSAMPLE` exchange using your preferred AMQP consumer.

3. Start the Siddhi application by clicking **Run**. The following message appears in the console:

    ```bash
    PublishRabbitmqInXmlFormat.siddhi - Started Successfully!
    ```

    !!! tip "Connection error?"
        If you see a connection error to `localhost:5672`, the RabbitMQ broker may not be running, or port `5672` may be in use. Verify your RabbitMQ instance is reachable, or change the URI in the sink configuration.

4. Send events using the Event Simulator. For instructions, see [Testing Siddhi Applications](../develop/testing-a-Siddhi-Application.md). Use the following values:

    | **Field**          | **Value**                       |
    |--------------------|---------------------------------|
    | **Siddhi App Name**| `PublishRabbitmqInXmlFormat`    |
    | **Stream Name**    | `SweetProductionStream`         |
    | **name**           | `toffee`                        |
    | **amount**         | `45.24`                         |

    Send a few more events with different values.

5. Your AMQP consumer receives XML-encoded events from the `RABBITMQSAMPLE` exchange. The decoded payload corresponds to the `LowProductionAlertStream` schema.

## Siddhi application

```sql
@App:name("PublishRabbitmqInXmlFormat")
@App:description("demonstrates how to configure WSO2 Integrator: SI to send sweet production events via RabbitMQ transport in XML format, and view the output via your AMQP consumer")

define stream SweetProductionStream (name string, amount double);

@sink(type ='rabbitmq', uri = 'amqp://guest:guest@localhost:5672', exchange.name = 'RABBITMQSAMPLE',
    @map(type='xml'))
define stream LowProductionAlertStream (name string, amount double);

from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
