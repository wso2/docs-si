## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to send sweet production events via HTTP transport in JSON default format and log the events in LowProductionAlertStream to the output console.

## Prerequisites

* Save this sample. If there is no syntax error, the following message is shown on the console:
    - Siddhi App PublishHttpInJsonFormat successfully deployed. 

## Executing the sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages are shown on the console:
    * `PublishHttpInJsonFormat.siddhi - Started Successfully!`
    * `'Http' sink at 'LowProductionAlertStream' stream successfully connected to 'localhost:8080/abc'.`

## Testing the sample

1. Open a terminal and navigate to `<SI-Tooling-Home>/samples/sample-clients/http-server` and run the `ant` command without any arguments.
2. Send events through one or more of the following methods:
    * **Send events with http server through the event simulator**
        1. Open the event simulator by clicking on the second icon or pressing Ctrl+Shift+I.
	    2. In the Single Simulation tab of the panel, specify the values as follows:
            * `Siddhi App Name`  : `PublishHttpInJsonFormat`
            * `Stream Name`     : `SweetProductionStream`
        3. In the `name` and `amount` fields, enter 'toffees' and '75.6' respectively and then click Send to send the event.
        4. Send some more events as desired.

    * **Send events to the HTTP endpoint defined by 'publish.url' in the Sink configuration using the curl command**
        1. Open a new terminal and issue the following command:
            * `curl -X POST -d '{"streamName": "SweetProductionStream", "siddhiAppName": "PublishHttpInJsonFormat","data": ['toffees', 75.6]}' http://localhost:9390/simulation/single -H 'content-type: text/plain'`
        2. If there is no error, the following messages are shown on the terminal:
            *  `{"status":"OK","message":"Single Event simulation started successfully"}`

    * **Publish events with Postman**
        1. Launch the 'Postman' application.
        2. Make a `Post` request to the `http://localhost:9390/simulation/single` endpoint. Set the `Content-Type` to `text/plain` and set the request body in text as follows:
            `{"streamName": "SweetProductionStream", "siddhiAppName": "PublishHttpInJsonFormat","data": ['toffees', 75.6]}`
        4. Click 'Send'. If there is no error, the following messages are shown on the console:
            *  `"status": "OK",`
            *  `"message": "Single Event simulation started successfully"`

## Viewing the results

* See the output on the terminal:

```bash
[java] [org.wso2.si.http.server.HttpServerListener] : Event Name Arrived: {"event":{"name":"toffees","amount":75.6}}
[java] [org.wso2.si.http.server.HttpServerMain] : Received Events: {"event":{"name":"toffees","amount":75.6}} ,
[java] [org.wso2.si.http.server.HttpServerMain] : Received Event Headers key set: [Http_method, Content-type, Content-length]
[java] [org.wso2.si.http.server.HttpServerMain] : Received Event Headers value set: [[POST], [application/json], [42]]
```

## Notes

If you get the message "LowProductionAlertStream' stream could not connect to 'localhost:8080", it could be due to the port 8080
defined in the Siddhi application is already being used by a different program. To resolve this issue, do the following:

1. Stop this Siddhi application (Click 'Run' on menu bar -> 'Stop').
2. Change the port from 8080 to an unused port in this Siddhi application's source configuration and in the http-server file.
3. Start the application and check whether the expected output appears on the console.


```sql
@App:name("PublishHttpInJsonFormat")

@App:description('Send events via HTTP transport using JSON format')

define stream SweetProductionStream (name string, amount double);

@sink(type='http', publisher.url='http://localhost:8080/abc',
@map(type='json'))
define stream LowProductionAlertStream (name string, amount double);

@info(name='query1') 
from SweetProductionStream
select *
insert into LowProductionAlertStream;
```
