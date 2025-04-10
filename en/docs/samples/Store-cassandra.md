## Purpose

This application demonstrates how to perform Cassandra operations using Siddhi queries. The sample depicts a scenario in a sweet production factory. The sweet production details, such as the name of the raw material and amount used for production, can be stored using `insertSweetProductionStream`. The following streams can be used to search, delete, update, update or insert the existing data in the store:

* Search - `searchSweetProductionStream`
* insert - `insertSweetProductionStream`
* delete - `deleteSweetProductionStream`
* update - `updateSweetProductionStream`
* update or insert - `updateOrInsertSweetProductionStream`
* contains - `containsSweetProductionStream` (verifies whether all the attributes that enter in the stream exist in the store)

## Prerequisites

1. Ensure that Cassandra version 3 or above is installed on your machine.
2. Add the DataStax Java driver into `{WSO2_SI_HOME}/lib` as follows:
    1. Download the [DataStax Java driver](https://repo1.maven.org/maven2/com/datastax/cassandra/cassandra-driver-core/3.3.2/cassandra-driver-core-3.3.2.jar)
    2. Use the `jartobundle` tool in `{WSO2_SI_Home}/bin` to extract and convert the above JARs into OSGi bundles.

        * For Windows:

            ```bash
            <SI_HOME>/bin/jartobundle.bat <PATH_OF_DOWNLOADED_JAR> <PATH_OF_CONVERTED_JAR>
            ```

        * For Linux:

            ```bash
            <SI_HOME>/bin/jartobundle.sh <PATH_OF_DOWNLOADED_JAR> <PATH_OF_CONVERTED_JAR>
            ```

        **Note: Please skip this step if the jar is already OSGi bunbled.**

    3. Copy the converted bundles to the {WSO2_SI_Home}/lib directory.

3. Create a keyspace named `production` in Cassandra store:

    ```sql
    CREATE KEYSPACE "production" WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};
    ```

4. In the store configuration of this application, replace 'username' and 'password' values with your Cassandra credentials.
5. Save this sample.

## Executing the Sample

1. Start the Siddhi application by clicking on 'Run'.
2. If the Siddhi application starts successfully, the following message is shown on the console.

    ```bash
    Store-cassandra.siddhi - Started Successfully!
    ```

## Note

If you want to edit this application while it's running, stop the application, make your edits and save the application, and then start it again.

## Testing the Sample

1. Simulate single events:
    1. Click on 'Event Simulator' (double arrows on left tab) and click 'Single Simulation'
    2. Select `Store-cassandra` as `Siddhi App Name` and select `searchSweetProductionStream` as `Stream Name`.
    3. Provide attribute values, and then click Send.
2. Send at least one event where the name matches a name value in the data you previously inserted into the `SweetProductionTable`. This will satisfy the 'on' condition of the join query.
3. Optionally, send events to the other corresponding streams to add, delete, update, insert, and search events.

## Notes

* After a change in the store, you can use the search stream to see whether the operation is successful.
* The Primary Key constraint in `SweetProductionTable` is disabled, because the name cannot be used as a `PrimaryKey` in a `ProductionTable`.
* You can use [Siddhi functions](http://wso2.github.io/siddhi/documentation/siddhi-4.0/#function) to create a unique ID for the received events, which can then be used to apply the Primary Key constraint on the data store records.

## Viewing the Results

See the output for raw materials on the console. You can use `searchSweetProductionStream` to check for inserted, deleted, and updated events.

```sql
@App:name("Store-cassandra")
@App:description('Receive events via simulator and persist the received data in the store.')

define stream insertSweetProductionStream (name string, amount double);
define stream deleteSweetProductionStream (name string);
define stream searchSweetProductionStream (name string);
define stream updateSweetProductionStream (name string, amount double);
define stream updateOrInsertSweetProductionStream (name string, amount double);
define stream containsSweetProductionStream (name string, amount double);

@sink(type='log')
define stream logStream(name string, amount double);

@store(type='cassandra' , cassandra.host='localhost', username='cassandra', password='cassandra',keyspace='production',
column.family='SweetProductionTable')
define table SweetProductionTable (name string, amount double);

/* Inserting event into the cassandra keyspace */
@info(name='query1')
from insertSweetProductionStream
insert into SweetProductionTable;

/* Deleting event from cassandra keyspace */
@info(name = 'query2')
from deleteSweetProductionStream
delete SweetProductionTable
on SweetProductionTable.name == name ;

/* Updating event from cassandra keyspace */
@info(name = 'query3')
from updateSweetProductionStream
update SweetProductionTable
on SweetProductionTable.name == name ;

/* Updating or inserting event from cassandra keyspace */
@info(name = 'query4')
from updateOrInsertSweetProductionStream
update or insert into SweetProductionTable
on SweetProductionTable.name == name;

/* Siddhi In in cassandra keyspace */
@info(name = 'query5')
from containsSweetProductionStream
[(SweetProductionTable.name == name and SweetProductionTable.amount == amount) in SweetProductionTable]
insert into logStream;

--Perform a join on raw material name so that the data in the store can be viewed
@info(name='query6')
from searchSweetProductionStream as s join SweetProductionTable as sp
    on s.name == sp.name
select sp.name, sp.amount
insert into logStream;
```
