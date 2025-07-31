# Receiving and Publishing Events in Custom CSV Format

## Purpose

This application demonstrates how to configure WSO2 Integrator: SI Tooling to publish and receive data events processed within Siddhi to files in CSV custom format.

!!!info "Before you begin:"
    1. Edit the sample Siddhi application as follows:<br/>
        - In the source configuration, update the value for the `dir.uri` parameter by replacing `<SI-Tooling-Home>` with the absolute path of your SI Tooling directory.<br/>
        - In the sink configuration, update the value for the `file.uri` parameter by replacing `<SI-Tooling-Home>` with the absolute path of your SI Tooling directory. If required, you can provide a different path to publish the output to a location of your choice.<br/>
    2. Save the sample Siddhi application in WSO2 Integrator: SI Tooling.

## Executing and testing the Sample

To execute the sample open the saved Siddhi application in WSO2 Integrator: SI Tooling, and start it by clicking the **Start** button or by clicking **Run** => **Run**.

If the Siddhi application starts successfully, the following message appears in the console.

`CSVCustomMapping.siddhi - Started Successfully!`

## Viewing the results

* The source gets the input from the `SI-Tooling-Home>/samples/artifacts/CSVMappingWithFile/new/example.csv` file and produces the event. This file has data in below format.

    `1,WSO2,23.5`<br/>
    `2,IBM,2.5`<br/>

* The sink gets the input from the source output and publishes the output in the `outputOfCustom.csv` file. The data is published in this file in the following format.

    `WSO2,1,100.0`<br/>
    `IBM,2,2.5`<br/>

```sql
@App:name("CSVCustomMapping")
@App:description('Publish and receive data events processed within Siddhi to files in CSV custom format.')

@source(type='file',
dir.uri='file://<SI-Tooling-Home>/samples/artifacts/CSVMappingWithFile/new',
action.after.process='NONE',
@map(type='csv', @attributes(id='0', name='1', amount='2')))
define stream IntputStream (name string, id int,  amount double);

@sink(type='file', file.uri='/<SI-Tooling-Home>/samples/artifacts/CSVMappingWithFile/new/outputOfCustom.csv' , @map(type='csv',@payload(id='1', name='0', amount='2')))
define stream OutputStream (name string, id int, amount double);

from IntputStream
select *
insert into OutputStream;
```
