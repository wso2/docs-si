## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator to receive events to the `SweetProductionStream` via HTTP transport in XML default format and log the events in `LowProductionAlertStream` to the output console.

## Executing the sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.
  
    * `Source Listener has created for url http://localhost:8006/productionStream`
    * `ReceiveHTTPInXMLFormatWithDefaultMapping.siddhi - Started Successfully!`

## Testing the sample

##### Option 1: Publish events with http sample client:

Navigate to `<SI-Tooling-Home>/samples/sample-clients/http-client` and run `ant` command as follows:

Run `ant` command in the terminal  as follows:

```bash
ant -Dtype=xml
```

If you want to publish custom number of events, you need to run `ant` command as follows:

```bash
ant -Dtype=xml -DnoOfEventsToSend=5
```

##### Option 2: Publish events with curl command:

Publish few events in xml format to the http endpoint as follows (The values for name and amount attributes can be changed as desired).

```bash
curl -X POST -d '<events><event><name>sugar</name><amount>300</amount></event></events>' http://localhost:8006/productionStream --header "Content-Type:application/xml"
```

##### Option 3: Publish events with Postman

1. Launch the Postman application.
2. Make a 'Post' request to 'http://localhost:8006/productionStream' endpoint. Set the Content-Type to `application/xml` and set the request body in xml format as follows.

    ```xml
    <events>
        <event>
            <name>sugar</name>
            <amount>200</amount>
        </event>
    </events>
    ```

## Notes

If you edit this application while it's running, stop the application -> Save -> Start.
If the message "Source Listener has created for url http://localhost:8006/productionStream" does not appear,it could be due to the port 8006, defined in the Siddhi application is already being used by a different program. To resolve this issue, please do the following,

* Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop')
* Change the port 8006 to an unused port, in this Siddhi application's source configuration.
* Start the application and check whether the specified messages appear on the console

## Viewing the results

See the output. Following message would be shown on the console if you use option 2 or 3 to publish events.

```bash
ReceiveHTTPInXMLFormatWithDefaultMapping : LowProducitonAlertStream : Event{timestamp=1511938781887, data=[sugar, 300.0], isExpired=false}
```

```sql
@App:name("ReceiveHTTPInXMLFormatWithDefaultMapping")
@App:description('Receive events via HTTP transport in XML format with default mapping and view the output on the console.')


@Source(type = 'http', receiver.url='http://localhost:8006/productionStream', basic.auth.enabled='false',
    @map(type='xml'))
define stream SweetProductionStream (name string, amount double);

@sink(type='log')
define stream LowProductionAlertStream (name string, amount double);

-- passthrough data in the SweetProductionStream into LowProducitonAlertStream
@info(name='query1')
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
