# Capturing MySQL Inserts and Updates via CDC Polling Mode

## Purpose

This sample demonstrates how to use the polling mode of the CDC source. In this example, you are capturing the inserts to a MySQL table.
By changing the database type, you can also try out this example for the following databases.

* Oracle
* H2
* MS SQL Server
* Postgresql
* MongoDB

!!!info "Before you begin:"
    1. Ensure that MySQL is installed on your computer.<br/>
    2. Add the MySQL JDBC driver to the `<SI_Tooling_Home>/lib` directory as follows:<br/>
        1. Download and copy the `mysql-connector-j-8.3.0.jar` JAR and place it in the `<SI_Tooling_Home>/lib` directory.<br/>
        2. Unzip the archive.<br/>
        3. Copy the `mysql-connector-java-5.1.45-bin.jar` JAR and place it in the `<SI_HOME>/lib` directory.<br/>
    3. Create a database named `production` by issuing the following command.<br/>
        `CREATE SCHEMA production;`<br/>
    4. Change the database by issuing the following command.<br/>
        `use production;`<br/>
    5. Create a table named `SweetProductionTable` by issuing the following command.<br/>
        `CREATE TABLE SweetProductionTable (last_update TIMESTAMP, name VARCHAR(20),amount double(10,2));`<br/>
    6. If you want to capture the changes from the last point of time the Siddhi application was stopped, enable state persistence by setting the `state.persistence enabled=true` property in the `<SI_Tooling_Home>/conf/server/deployment.yaml` file. If you do not enable state persistence, only the changes since the Siddhi application started are captured.<br/>

    7. In the sample Siddhi application, update the `username` and `password` parameters in the source configuration by adding the username and password you use to log in to MySQL as the values. Then save the sample Siddhi application in Streaming Integrator Tooling.

## Executing the sample

To execute the sample open the saved Siddhi application in Streaming Integrator Tooling, and start it by clicking the **Start** button or by clicking **Run** => **Run**.

If the Siddhi application starts successfully, the following message appears in the console.

`CDCWithPollingMode.siddhi - Started Successfully!`

!!!note
    If you want to edit the Siddhi application after you have started it, stop it first, make your edits, save it and then start it again.

## Testing the sample

To test the sample Siddhi application, insert a record to the `SweetProductionTable` table you created by issuing the following command.

`INSERT into SweetProductionTable(name,amount) values('chocolate',100.0);`

## Viewing the results

The insert operation is logged in the Streaming Integrator console as shown below.

![Polling Log]({{base_path}}/images/cdc-with-polling-mode-sample/cdc-with-polling-mode.png)

!!!info
    You can also update the existing row and observe the change data events.

!!!tip
    For updates, the previous values of the row are not returned with the event. Use listening mode to obtain such details.

    The polling mode can also be used with Oracle, MS-SQL server, Postgres, H2.

```sql
@App:name("CDCWithPollingMode")
@App:description("Capture MySQL Inserts and Updates using cdc source polling mode.")


@source(type = 'cdc',
    url = 'jdbc:mysql://localhost:3306/production?useSSL=false',
    mode = 'polling',
    jdbc.driver.name = 'com.mysql.jdbc.Driver',
    polling.column = 'last_update',
    polling.interval = '1',
    username = '',
    password = '',
    table.name = 'SweetProductionTable',
    @map(type = 'keyvalue' ))
define stream insertSweetProductionStream (name string, amount double);

@sink(type = 'log')
define stream logStream (name string, amount double);

@info(name = 'query')
from insertSweetProductionStream
select name, amount
insert into logStream;
```

