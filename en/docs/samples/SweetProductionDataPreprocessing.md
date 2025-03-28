## Purpose

This application demonstrates how to receive events via TCP transport and carryout data pre-processing with numerous Siddhi extensions (eg. string extension, time extension). For more information on Siddhi extensions please refer [siddhi-extensions](https://wso2.github.io/siddhi/extensions/). In this sample, a composite ID is obtained using string concatenation and the time format of the incoming event

## Prerequisites

1. Ensure that MySQL is installed on your machine.
2. Add the MySQL JDBC driver into `{WSO2_SI_HOME}/lib` as follows:
    1. Download and copy the `mysql-connector-j-8.3.0.jar` to the `{WSO2_SI_Home}/lib` directory.
3. Create a database named `sampleDB` in MySQL. This database is referred to with `jdbc:mysql://localhost:3306/sampleDB` url.
4. In the store configuration of this application, replace `username` and `password` values with your MySQL credentials.
5. Save this sample.

## Executing the Sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following messages would be shown on the console.

    ```bash
    * Tcp Server started in 0.0.0.0:9892
    * SweetProductionDataPreprocessing.siddhi - Started Successfully!
    ```

## Testing the Sample

Navigate to `{WSO2SIHome}/samples/sample-clients/tcp-client` and run the `ant` command as follows.

```bash
ant -Dtype=binary
```

If you want to publish custom number of events, you need to run `ant` command as follows.

```bash
ant -Dtype=binary -DnoOfEventsToSend=5
```

## Viewing the Results

Check the `ProcessedSweetProductionTable` created in `sampleDB`. You would be able to see the pre-processed data written to the table

```sql
@App:name("SweetProductionDataPreprocessing")
@App:description('Collect data via TCP transport and pre-process')

@source(type='tcp',
        context='SweetProductionStream',
        port='9892',
        @map(type='binary'))
define stream SweetProductionStream (name string, amount double);

@Store(type="rdbms",
       jdbc.url="jdbc:mysql://localhost:3306/sampleDB?useSSL=false",
       username="root",
       password="mysql" ,
       jdbc.driver.name="com.mysql.jdbc.Driver")
@PrimaryKey("compositeID")
define table ProcessedSweetProductionTable (compositeID string, amount double, date string);

--Process smart home data by concatenating the IDs and formatting the time
@info(name='query1')
from SweetProductionStream
select str:concat(str:lower(name), "::", time:currentTimestamp()) as compositeID, amount, time:currentDate() as date
insert into ProcessedSweetProductionTable;
```
