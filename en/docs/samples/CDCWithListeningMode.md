# Capturing MySQL Inserts via CDC

## Purpose

This sample demonstrates how to capture change data from MySQL using Siddhi. The change events that can be captured include `INSERT`, `UPDATE`, and `DELETE`.

!!!info "Before you begin:"
    1. Ensure that MySQL is installed on your computer.<br/>
    2. Add the MySQL JDBC driver to the `<SI_Tooling_Home>/lib` directory as follows:<br/>
        1. Download the JDBC driver from the [MySQL website](https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.45.tar.gz).<br/>
        2. Unzip the archive.<br/>
        3. Download and copy the `mysql-connector-j-8.3.0.jar` JAR and place it in the `<SI_Tooling_Home>/lib` directory.<br/>
    3. Configure MySQL to [enable binary logging](https://debezium.io/docs/connectors/mysql/#enabling-the-binlog).<br/><br/>
            If you are using MySQL 8.0, use the following query to check the binlog status:<br/>
            ```bash
            SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
            FROM performance_schema.global_variables WHERE variable_name='log_bin';
            ```
    4. Enable state persistence in siddhi applications. To do this, open the `<SI_Tooling_Home>/conf/server/deployment.yaml` file and set the `state.persistence enabled=true` property.<br/>
    5. Create a database named `production` by issuing the following command.<br/>
        `CREATE DATABASE production;`<br/>
    6. Create a user named `wso2sp` with `wso2` as the password, and with `SELECT`, `RELOAD`, `SHOW DATABASES`, `REPLICATION SLAVE`, `REPLICATION CLIENT` privileges. To do this, issue the following command.<br/>
        `GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'wso2sp' IDENTIFIED BY 'wso2';`<br/>
    7. Change the database by issuing the following command.<br/>
        `use production;`<br/>
    8. Create a table named `SweetProductionTable`.<br/>
        `CREATE TABLE SweetProductionTable (name VARCHAR(20),amount double(10,2));`<br/>
    9. Save the sample Siddhi application in Streaming Integrator Tooling.

## Executing the sample

To execute the sample open the saved Siddhi application in Streaming Integrator Tooling, and start it by clicking the **Start** button or by clicking **Run** => **Run**.

If the Siddhi application starts successfully, the following message appears in the console.

`CDCWithListeningMode.siddhi -  Started Successfully!`

!!!note
    If you want to edit the Siddhi application after you have started it, stop it first, make your edits, save it and then start it again.

## Testing the sample

To test the sample Siddhi application, insert a record to the `SweetProductionTable` table you created by issuing the following command:

`INSERT into SweetProductionTable values('chocolate',100.0);`

## Viewing the results

This insert is logged in the Streaming Integrator console as follows.

![Insert Log]({{base_path}}/images/cdc-with-listening-mode-sample/insert-log.png)

!!!info
    Optionally, you can use this sample to also capture `update` and `delete` operations.<br/>

    - delete operation events include `before_name` and `before amount` keys.<br/>
    - update operation events include the `before_name`, `name`, `before_amount`, `amount` keys.

```sql
@App:name('CDCWithListeningMode')
@App:description('Capture MySQL Inserts using cdc source listening mode.')


@source(type = 'cdc', url = 'jdbc:mysql://localhost:3306/production', username = 'wso2sp', password = 'wso2', table.name = 'SweetProductionTable', operation = 'insert',
    @map(type = 'keyvalue'))
define stream insertSweetProductionStream (name string, amount double);

@sink(type = 'log')
define stream logStream (name string, amount double);

@info(name = 'query')
from insertSweetProductionStream
select name, amount
insert into logStream;
```
