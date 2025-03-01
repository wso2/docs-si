## Purpose

This application demonstrates how to configure WSO2 Streaming Integrator Tooling to send HTTP events to an OAuth-protected endpoint. Here we use password grant type.

## Prerequisites

1. Replace the Sink configuration values for following options.
    - `oauth.username`: Sender's OAuth username (Ex:- 'username123')
    - `oauth.password` : Sender's OAuth password (Ex:- 'password123')
    - `publisher.url` : Publisher URL (Ex:- 'https://localhost:8005/abc')
    - `consumer.key`  : Consumer key for the HTTP request (Ex:- 'abcdef')
    - `consumer.secret`: Consumer secret for the HTTP request (Ex:- 'abcdef')
    - `token.url`     : URL of the token end point (Ex:- 'https://localhost:8005/token')
    - `method`        : Method type (Eg:- `POST`)

    Optional (You can fill this if it is different from default values)

    - `header` (Authorization header): Access token for the HTTP request. By default, it is automatically retrieved using the `password`, `client-credential`, or the `refresh-token` grant type. Here the grant type depends on the user input.
    - `https.truststore.file`: API trust store path (Ex:- `<some-path>client-truststore.jks`). By default, it obtained from the product pack (Ex:- `${carbon.home}/resources/security/client-truststore.jks`).
    - `https.truststore.password`:  API trust store password (Ex:- `wso2carbon`). By default, it is set as `wso2carbon`.

2. Save this sample. If there is no syntax error, the following message is shown on the console:
    * `Siddhi App PublishHttpOAuthRequestWithOAuthUser successfully deployed.`

## Executing the Sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages are shown on the console:
    * `PublishHttpOAuthRequestWithOAuthUser.siddhi - Started Successfully!`
    * `'Http' sink at 'LowProductionAlertStream' stream successfully connected to 'https://localhost:8005/abc'.`

## Testing the Sample

Send events through one or more of the following methods:

### Send events with http server through the event simulator

1. Open the event simulator by clicking on the second icon or pressing Ctrl+Shift+I.
2. In the Single Simulation tab of the panel, specify the values as follows:
    - `Siddhi App Name`  : `PublishHttpOAuthRequestWithOAuthUser`
    - `Stream Name`     : `SweetProductionStream`
3. In the `name` and `amount` fields, enter 'toffees' and '75.6' respectively and then click Send to send the event.
4. Send some more events as desired.

### Send events to the HTTP endpoint defined by 'publish.url' in the Sink configuration using the curl command

1. Open a new terminal and issue the following command:

    ```bash
    curl -X POST -d '{"streamName": "SweetProductionStream", "siddhiAppName": "PublishHttpOAuthRequestWithOAuthUser","data": ['toffees', 75.6]}' http://localhost:9390/simulation/single -H 'content-type: text/plain'
    ```

2. If there is no error, the following messages are shown on the terminal:
    - `{"status":"OK","message":"Single Event simulation started successfully"}`

### Publish events with Postman

1. Launch the application.
2. Make a `Post` request to the `http://localhost:9390/simulation/single` endpoint. Set the `Content-Type` to `text/plain` and set the request body in text as follows:
`{"streamName": "SweetProductionStream", "siddhiAppName": "PublishHttpOAuthRequestWithOAuthUser","data": ['toffees', 75.6]}`
3. Click `Send`. If there is no error, the following messages are shown on the console:
    - `"status": "OK"`
    - `"message": "Single Event simulation started successfully"`

## Viewing the Results

See the output on the terminal:

```bash
Siddhi App test successfully deployed.
INFO {org.wso2.extension.siddhi.io.http.sink.HttpSink} - Request sent successfully to https://localhost:8005/abc
[java] [org.wso2.si.http.server.HttpServerListener] : Event Name Arrived: {"event":{"name":"toffees","amount":75.6}}
[java] [org.wso2.si.http.server.HttpServerMain] : Received Event Names:{"event":{"name":"toffees","amount":75.6}} ,
[java] [org.wso2.si.http.server.HttpServerMain] : Received Event Headers key set:[Http_method, Content-type, Content-length]
[java] [org.wso2.si.http.server.HttpServerMain] : Received Event Headers value set:[[POST], [application/json], [42]]
```

## Notes

If you get the message `Error when pushing events to Siddhi debugger engine`, it could be due to time out problem, do the following:

1. Stop this Siddhi application (Click 'Run' on the menu bar -> 'Stop').
2. Start the application and check whether the expected output appears on the console.

If you get the status code `400`, it could be due to passing invalid parameter problem, do the following:

1. Stop this Siddhi application (Click 'Run' on the menu bar -> 'Stop').
2. Recheck all the parameter you are passing and change the correct parameter
3. Start the application and check whether the expected output appears on the console.

If you get the status code `500`, it could be due to Internal server error problem, do the following:

1. Stop this Siddhi application (Click 'Run' on the menu bar -> 'Stop').
2. Start the application again and check whether the expected output appears on the console.

```sql
@App:name("PublishHttpOAuthRequestWithOAuthUser")
@App:description("Send HTTP events to an OAuth-protected endpoint. Here we use password grant type.")

  define stream SweetProductionStream (name string, amount double);

  @sink(type='http', oauth.username="xxxx", oauth.password="xxxx",
  publisher.url='https://localhost:8005/abc', headers="'Authorization:  Bearer xxxxxxxxx'",
  consumer.key="xxxxxxxxxx", consumer.secret="xxxxxxxxxxx", token.url='https://localhost:8005/token',
  method="xxxxxx", @map(type='json', @payload( "{'name': {{name}}, 'amount': {{amount}}}")))
  define stream LowProductionAlertStream ( name string, amount double);

  @info(name='query1')
  from SweetProductionStream
  select *
  insert into LowProductionAlertStream;
```
