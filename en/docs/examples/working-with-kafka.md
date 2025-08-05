# Working with Kafka

## Introduction

The WSO2 Integrator: SI can consume from a Kafka topic as well as to publish to a Kafka topic in a streaming manner.

This tutorial takes you through consuming from a Kafka topic, processing the messages, and finally, publishing output to a Kafka topic.

!!!tip "Before you begin:"
    Prepare the server to consume from or to publish to Kafka, follow the steps below:<br/>
    <br/>
        1. Download the Kafka broker from [the Apache site](https://www.apache.org/dyn/closer.cgi?path=/kafka/2.3.0/kafka_2.12-2.3.0.tgz) and extract it.
        From here onwards, this directory is referred to as `<Kafka_Home>`. <br/>
        2. Create a directory named `Source` in a preferred location in your machine and copy the following JARs to it from the `<Kafka_Home>/libs` directory.<br/>
        <br/>
            - `kafka_2.12-2.3.0.jar`<br/>
            - `kafka-clients-2.3.0.jar`<br/>
            - `metrics-core-2.2.0.jar`<br/>
            - `scala-library-2.12.8.jar`<br/>
            - `zkclient-0.11.jar`<br/>
            - `zookeeper-3.4.14.jar`<br/>
            <br/>
        3. Create another directory named `Destination` in a preferred location in your machine.<br/>
        <br/>
        4. To convert the Kafka JARS you copied to the `Source` directory, issue the following command:<br/>
           ```
           sh <SI-Home>/bin/jartobundle.sh <{Source}_Directory_Path> <{Destination}_Directory_Path>
           ```<br/>
           <br/>
        5. Copy all the jars from the `Destination` directory to the `<SI-Home>/lib` directory.

## Tutorial steps

### Consuming data from Kafka

### Start Kafka

1. Navigate to the `<Kafka_Home>` directory and start a zookeeper node by issuing the following command.

    `sh bin/zookeeper-server-start.sh config/zookeeper.properties`

2. Navigate to the `<Kafka_Home>` directory and start Kafka server node by issuing the following command.

    `sh bin/kafka-server-start.sh config/server.properties`

### Start the WSO2 Integrator: SI

Navigate to the `<SI-Home>/bin` directory and issue the following command. 
`sh server.sh`

The following log appears on the SI console when the server is started successfully.

```bash
INFO {org.wso2.carbon.kernel.internal.CarbonStartupHandler} - WSO2 Integrator: SI started in 4.240 sec
```

### Consume from a Kafka topic

Let's create a basic Siddhi application to consume messages from a Kafka topic.

1. Open a text file and copy-paste following Siddhi application to it.

    ```sql
    @App:name("HelloKafka")

    @App:description('Consume events from a Kafka Topic and log the messages on the console.')

    @source(type='kafka',
            topic.list='productions',
            threading.option='single.thread',
            group.id="group1",
            bootstrap.servers='localhost:9092',
            @map(type='json'))
    define stream SweetProductionStream (name string, amount double);

    @sink(type='log')
    define stream OutputStream (name string, amount double);

    -- Query to transform the name to upper case.
    from SweetProductionStream
    select str:upper(name) as name, amount
    insert into OutputStream;
    ```

2. Save this file as `HelloKafka.siddhi` in the `<SI-Home>/wso2/server/deployment/siddhi-files` directory. The following log appears on the SI console.

    ```bash
    INFO {org.wso2.carbon.streaming.integrator.core.internal.StreamProcessorService} - Siddhi App HelloKafka deployed successfully
    ```

!!! info
    You just created a Siddhi application that listens to a Kafka topic named `productions` and logs any incoming messages. When logging, the name attribute of the message is converted to upper case. However, you have still not created this Kafka topic or published any messages to it. To do this, proceed to the next section.

#### Generate Kafka messages

Now let's generate some Kafka messages that the WSO2 Integrator: SI can receive. 

1. First, let's create a topic named `productions` in the Kafka server. To do this, navigate to `<Kafka_Home>` and run following command:

    ```bash
    bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic productions
    ```

2. Now let's run the Kafka command line client to push a few messages to the Kafka server.

    ```bash
    bin/kafka-console-producer.sh --broker-list localhost:9092 --topic productions
    ```

3. Now you are prompted to type messages in the console. Type the following in the command prompt:

    ```json
    {"event":{ "name":"cookie", "amount":100.0}}
    ```

   This pushes a message to the Kafka Server. Then, the Siddhi application you deployed in the WSO2 Integrator: SI consumes this message. As a result, the WSO2 Integrator: SI log displays the following:

```bash
INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562069868006, data=[ALMOND COOKIE, 100.0], isExpired=false}
```

You may notice that the output message has an uppercase name: `ALMOND COOKIE`. This is because of the simple message transformation done in the Siddhi application.

### Consuming with an offset

Previously, you consumed messages from the `productions` topic *without specifying an offset*. In other words, the Kafka offset was zero. In this section, instead of consuming with a zero offset, you specify an offset value and consume messages from that offset onwards.

For this purpose, you can configure the `topic.offsets.map` parameter. Let's modify our previous Siddhi application to specify an offset value. Specify an offset value `2` so that the Siddhi application consumes messages with index `2` and above.

1. Open the `<SI-Home>/wso2/server/deployment/siddhi-files/HelloKafka.siddhi` file and add the following new configuration parameters.

    ```sql
    topic.offsets.map='productions=2',
    partition.no.list='0'
    ```

    Now the complete Siddhi application is as follows.

    ```sql
    @App:name("HelloKafka")

    @App:description('Consume events from a Kafka Topic and log the messages on the console.')

    @source(type='kafka',
            topic.list='productions',
            threading.option='single.thread',
            group.id="group1",
            bootstrap.servers='localhost:9092',
            partition.no.list='0',
            topic.offsets.map='productions=2',
            @map(type='json'))
    define stream SweetProductionStream (name string, amount double);

    @sink(type='log')
    define stream OutputStream (name string, amount double);

    from SweetProductionStream
    select str:upper(name) as name, amount
    insert into OutputStream;
    ```

2. Save the file.

3. Push the following message to the Kafka server.

    ```json
    {"event":{ "name":"Baked alaska", "amount":20.0}}
    ```

    Note that this is the second message that you pushed (hence bearing index 1), and therefore it is not consumed by the WSO2 Integrator: SI.

4. Let's push another message (bearing index 2) to the Kafka server.

    ```json
    {"event":{ "name":"Cup cake", "amount":300.0}}
    ```

   Now you can see the following log in the WSO2 Integrator: SI Studio console.

```bash
INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562676477785, data=[CUP CAKE, 300.0], isExpired=false}
```

As you configured your Siddhi application to consume messages with offset `2`, all messages bearing index `2` or above are consumed.

### Adding more consumers to the consumer group

In our `HelloKafka` Siddhi application, note the `group.id` parameter. This parameter defines the Kafka consumer group.

Let's add another Siddhi application `HelloKafka_2`, to add another Kafka consumer to the same consumer group.

1. Open a text file and copy-paste following Siddhi application to it.

    ```sql
    @App:name("HelloKafka_2")
    
    @App:description('Consume events from a Kafka Topic and log the messages on the console.')
    
    @source(type='kafka',
            topic.list='productions',
            threading.option='single.thread',
            group.id="group1",
            bootstrap.servers='localhost:9092',
            @map(type='json'))        
    define stream SweetProductionStream (name string, amount double);
    
    @sink(type='log')
    define stream OutputStream (name string, amount double);
    
    from SweetProductionStream
    select str:upper(name) as name, amount   
    insert into OutputStream;
    ```

2. Save this file as `HelloKafka_2.siddhi` in the `<SI-Home>/wso2/server/deployment/siddhi-files` directory. When the Siddhi application is successfully deployed, the following `INFO` log appears in the WSO2 Integrator: SI console.

    ```bash
    INFO {org.wso2.carbon.stream.processor.core.internal.StreamProcessorService} - Siddhi App HelloKafka_2 deployed successfully
    ```

3. Navigate to the `<Kafka_Home>` directory and run following command.

    ```bash
    bin/kafka-topics.sh --alter --bootstrap-server localhost:9092 --partitions 2 --topic productions
    ```

   This adds another partition to the `productions` Kafka topic. 

4. Push following messages to the Kafka server using the Kafka Console Producer.

    ```json
    {"event":{ "name":"Doughnut", "amount":500.0}} 
    ```

    ```json
    {"event":{ "name":"Danish pastry", "amount":200.0}} 
    ```

    ```json
    {"event":{ "name":"Eclair", "amount":400.0}} 
    ```

    ```json
    {"event":{ "name":"Eclair toffee", "amount":100.0}} 
    ```

   Now observe the logs on the SI console.
    ```
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka_2 : OutputStream : Event{timestamp=1562759480019, data=[DOUGHNUT, 500.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562759494710, data=[DANISH PASTRY, 200.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka_2 : OutputStream : Event{timestamp=1562759506252, data=[ECLAIR, 400.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562759508757, data=[ECLAIR TOFFEE, 100.0], isExpired=false}
    ```

   You can see that the events are being received by the two consumers in a Round Robin manner. Events received by the first consumer are logged by Siddhi application `HelloKafka`, whilst events received by the second consumer are logged by the `HelloKafka_2` Siddhi application.

### Assigning consumers to partitions

In the previous scenario, you had two partitions for the Kafka topic and two consumers. Instead of assigning the consumers to the partitions, you allowed Kafka do the assignments. Optionally, you can assign consumers to partitions.

This option is useful if you have multiple consumers with different performance speeds, and you need to balance the load among the consumers.

Let's alter your topic to have three partitions. After that, you can assign two partitions to `consumer-1`, and the remaining partition to `consumer-2`.

1. Navigate to the `<Kafka_Home>` directory and issue following command.

    ```  
    bin/kafka-topics.sh --alter --bootstrap-server localhost:9092 --partitions 3 --topic productions
    ```

   This adds another partition to the `productions` Kafka topic. Now there are three partitions in total. 

2. To assign partitions to the consumers, add the `partition.no.list` parameter as shown below.

    ```sql 
    @App:name("HelloKafka")
    
    @App:description('Consume events from a Kafka Topic and log the messages on the console.')
    
    -- consumer-1
    @source(type='kafka',
            topic.list='productions',
            threading.option='single.thread',
            group.id="group1",
            bootstrap.servers='localhost:9092',
            partition.no.list='0,1',
            @map(type='json'))
    define stream SweetProductionStream1 (name string, amount double);
    
    -- consumer-2
    @source(type='kafka',
            topic.list='productions',
            threading.option='single.thread',
            group.id="group1",
            bootstrap.servers='localhost:9092',
            partition.no.list='2',
            @map(type='json'))
    define stream SweetProductionStream2 (name string, amount double);
    
    @sink(type='log')
    define stream OutputStream (name string, amount double, id string);
    
    from SweetProductionStream1
    select str:upper(name) as name, amount, 'consumer-1' as id
    insert into OutputStream;
    
    from SweetProductionStream2
    select str:upper(name) as name, amount, 'consumer-2' as id
    insert into OutputStream;
    ```

    Note that `consumer-1` is assigned partitions `0` and `1`, while `consumer-2` is assigned partition `2`.

3. Now let's publish some messages as follows, and see how the load is distributed among the consumers with the new partition assignments.

    ```json
    {"event":{ "name":"Fortune cookie", "amount":100.0}} 
    ```

    ```json
    {"event":{ "name":"Frozen yogurt", "amount":350.0}} 
    ```

    ```json
    {"event":{ "name":"Gingerbread", "amount":450.0}} 
    ```

    ```json
    {"event":{ "name":"Hot-fudge sundae", "amount":150.0}} 
    ```

    ```json
    {"event":{ "name":"Hot-chocolate pudding", "amount":200.0}} 
    ```

    ```json
    {"event":{ "name":"Ice cream cake", "amount":250.0}} 
    ```

4. Now observe the WSO2 Integrator: SI logs. The following is displayed.

    ```bash
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562851086792, data=[FORTUNE COOKIE, 100.0, consumer-1], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562851092100, data=[FROZEN YOGURT, 350.0, consumer-1], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562851094459, data=[GINGERBREAD, 450.0, consumer-2], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562851096434, data=[HOT-FUDGE SUNDAE, 150.0, consumer-1], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562851098328, data=[HOT-CHOCOLATE PUDDING, 200.0, consumer-1], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - HelloKafka : OutputStream : Event{timestamp=1562851100309, data=[ICE CREAM CAKE, 250.0, consumer-2], isExpired=false}
    ```

   You can observe a pattern where the load is distributed among `consumer-1` and `consumer-2` in the 2:1 ratio. This is because you assigned two partitions to `consumer-1` and assigned only one partition to `consumer-2`.

### Publish to a Kafka topic

Now let's create a new Siddhi application to consume from the `productions` topic, filter the incoming messages based on a condition, and then publish those filtered messages to another Kafka topic.

1. First, let's create a new topic named `bulk-orders` in the Kafka server.

2. To publish the filtered messages to the `bulk-orders` Kafka topic you created, issue the following command.

    ```bash
    bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic bulk-orders
    ```

3. Next, let's create the Siddhi application. Open a text file, and copy-paste following Siddhi application into it.

    ```sql
    @App:name("PublishToKafka")

    @App:description('Consume events from a Kafka Topic, do basic filtering and publish filtered messages to a Kafka topic.')

    @source(type='kafka',
            topic.list='productions',
            threading.option='single.thread',
            group.id="group2",
            bootstrap.servers='localhost:9092',
            @map(type='json'))
    define stream SweetProductionStream (name string, amount double);

    @sink(type='kafka',
            topic='bulk-orders',
            bootstrap.servers='localhost:9092',
            partition.no='0',
            @map(type='json'))
    define stream BulkOrdersStream (name string, amount double);

    from SweetProductionStream[amount > 50]
    select *
    insert into BulkOrdersStream;
    ```

4. Save this file as `PublishToKafka.siddhi` in the `<SI-Home>/wso2/server/deployment/siddhi-files` directory. When the 
   Siddhi application is successfully deployed, the following `INFO` log appears in the WSO2 Integrator: SI console.

    ```bash
    INFO {org.wso2.carbon.streaming.integrator.core.internal.StreamProcessorService} - Siddhi App PublishToKafka deployed successfully
    ```

    !!!info
        The `PublishToKafka` Siddhi application consumes all the messages from the `productions` topic and populates the `SweetProductionStream` stream. All the sweet production runs where the amount is greater than 100 are inserted into the `BulkOrdersStream` stream. These events are pushed to the `bulk-orders` Kafka topic.

5. To observe the messages in the `bulk-orders` topic, run a Kafka Console Consumer. Then navigate to the `<Kafka_Home>` directory and issue the following command.

    ```bash
    bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic bulk-orders --from-beginning
    ```

   You can see the following message in the Kafka Consumer log. These indicate the production runs of which the amount is greater than 50.

    ```json
    {"event":{ "name":"Almond cookie", "amount":100.0}}
    ```

### Preserving the state of the application through a system failure

Let's try out a scenario in which you deploy a Siddhi application to count the total number of productions.

!!!info
    In this scenario, the SI server is required to *remember* the current count through system failures so that when the system is restored, the count is not reset to zero.

    To achieve this, you can use the state persistence capability in the WSO2 Integrator: SI.

1. Enable state persistence feature in SI server as follows. Open the `<SI-Home>/conf/server/deployment.yaml` file on a text editor and locate the `state.persistence` section.  

    ```yaml
      # Periodic Persistence Configuration
    state.persistence:
      enabled: true
      intervalInMin: 1
      revisionsToKeep: 2
      persistenceStore: org.wso2.carbon.streaming.integrator.core.persistence.FileSystemPersistenceStore
      config:
        location: siddhi-app-persistence
    ```

    Set `enabled` parameter to `true` and save the file.

2. Enable state persistence debug logs as follows. Open the `<SI-Home>/conf/server/log4j2.xml` file on a text editor and locate following line in it.

    ```xml
     <Logger name="com.zaxxer.hikari" level="error"/>
    ```

    Add following `<Logger>` element below that.

    ```xml
    <Logger name="org.wso2.carbon.streaming.integrator.core.persistence" level="debug"/>
    ```

    Save the file.

3. Restart the WSO2 Integrator: SI server for above change to be effective.

4. Let's create a new topic named `sandwich_productions` in the Kafka server. To do this, navigate to `<Kafka_Home>` and run following command:

    ```bash
    bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic sandwich_productions
    ```

5. Open a text file and copy-paste following Siddhi application to it.

    ```sql
    @App:name("CountProductions")

    @App:description('Siddhi application to count the total number of orders.')

    @source(type='kafka',
            topic.list='sandwich_productions',
            threading.option='single.thread',
            group.id="group3",
            bootstrap.servers='localhost:9092',
            partition.no.list='0',
            @map(type='json'))
    define stream SandwichProductionStream (name string, amount double);

    @sink(type='log')
    define stream OutputStream (totalProductions double);

    from SandwichProductionStream
    select sum(amount) as totalProductions
    insert into OutputStream;
    ```

6. Save this file as `CountProductions.siddhi` in the `<SI-Home>/wso2/server/deployment/siddhi-files` directory. When the Siddhi application is successfully deployed, the following `INFO` log appears in the WSO2 Integrator: SI console.

    ```bash
    INFO {org.wso2.carbon.stream.processor.core.internal.StreamProcessorService} - Siddhi App CountProductions deployed successfully
    ```

7. Now let's run the Kafka command line client to push a few messages to the Kafka server. Navigate to `<Kafka_Home>` and run following command:

    ```bash
    bin/kafka-console-producer.sh --broker-list localhost:9092 --topic sandwich_productions
    ```

8. Now you are prompted to type the messages in the console. Type following in the command prompt:

    ```json
    {"event":{ "name":"Bagel", "amount":100.0}}
    ```

    ```json
    {"event":{ "name":"Buterbrod", "amount":100.0}} 
    ```

    Now the following logs appear on the SI console.

    ```bash
    INFO {io.siddhi.core.stream.output.sink.LogSink} - CountProductions : OutputStream : Event{timestamp=1563903034768, data=[100.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - CountProductions : OutputStream : Event{timestamp=1563903034768, data=[200.0], isExpired=false}
    ```

    These logs print the sandwich production count. Note that the current count of sandwich productions is being printed as `200` in the second log. This is because the production count up to now is `200` sandwiches: `100` bagels and `100` buterbrods.

9. Now wait for following log to appear on the SI console

    ```bash
    DEBUG {org.wso2.carbon.streaming.integrator.core.persistence.FileSystemPersistenceStore} - Periodic persistence of CountProductions persisted successfully
    ```

    This log indicates that the current state of the Siddhi application is successfully persisted. Siddhi application state is persisted every minute. Therefore, you can notice this log appearing every minute.

    Next, let's push two sandwich production messages to the Kafka server and shutdown the SI server before state persistence happens (i.e., before the above log appears).

    !!!Tip
        It is better to start pushing messages immediately after the state persistence log appears, so that you have plenty of time to push messages and shutdown the server, until next log appears.

10. Now push following messages to the Kafka server using the Kafka Console Producer:

    ```json
    {"event":{ "name":"Croissant", "amount":100.0}}
    ```

    ```json
    {"event":{ "name":"Croutons", "amount":100.0}} 
    ```

11. Shutdown SI server. Here you are deliberately creating a scenario where the server crashes before the SI server could persist the latest production count.

    !!!info
        Here the SI server crashes before the state is persisted. Therefore the SI server cannot persist the latest count (which should include the last two productions `100` Croissants and `100` Croutons). The good news is, the Kafka source replays the last two messages, thereby allowing the WSO2 Integrator: SI to successfully recover from the server crash.

12. Restart the SI server and wait for about one minute to observe the following logs.

    ```bash
    INFO {io.siddhi.core.stream.output.sink.LogSink} - CountProductions : OutputStream : Event{timestamp=1563904912073, data=[300.0], isExpired=false}
    INFO {io.siddhi.core.stream.output.sink.LogSink} - CountProductions : OutputStream : Event{timestamp=1563904912076, data=[400.0], isExpired=false}
    ```

Note that the Kafka source has replayed the last two messages. As a result, the sandwich productions count is correctly restored.
