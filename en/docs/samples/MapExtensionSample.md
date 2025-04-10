## Purpose

This function creates a map and added values and checks whether values are available

## Prerequisites

* Save this sample. If there is no syntax error, the following messages would be shown on the console
    - `Siddhi App MapExtensionSample successfully deployed.`

## Executing the Sample

1. Start the Siddhi application by clicking on 'Run'
2. If the Siddhi application starts successfully, the following messages would be shown on the console
    * `MapExtensionSample.siddhi - Started Successfully!`

## Testing the Sample

You can publish data event to the file, through event simulator

1. Open event simulator by clicking on the second icon or press Ctrl+Shift+I.
2. In the Single Simulation tab of the panel, select values as follows:
    * `Siddhi App Name`  : `MapExtensionSample`
    * `Stream Name`     : `SweetProductionStream`
3. Enter following values in the fields and send
    * name: chocolate cake
    * amount: 50.50

## Viewing the Results

Messages similar to the following would be shown on the console.

```bash
INFO {io.siddhi.core.query.processor.stream.LogStreamProcessor} - MapExtensionSample: Event: , StreamEvent{ timestamp=1513384974698, beforeWindowData=null, onAfterWindowData=null, outputData=[true, false], type=CURRENT, next=null}
```

```sql
@app:name("MapExtensionSample")

@app:description('Insert values into a map and access')

@sink(type='log')
define stream CheckedMapStream(isMap1 bool, isMap2 bool);

define stream SweetProductionStream (name string, amount double);

@info(name = 'query1')
from SweetProductionStream
select name, amount, map:create() as tmpMap
insert into tmpStream;

@info(name = 'query2')
from tmpStream  select name, amount, map:put(tmpMap,name,amount) as map1
insert into outputStream;

@info(name = 'query3')
from outputStream
select map:isMap(map1) as isMap1, map:isMap(name) as isMap2
insert into CheckedMapStream;
```
