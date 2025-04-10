# Streaming Integrator Quick Start Guide

## Introduction

This quick start guide gets you started with the Streaming Integrator (SI), in just 5 minutes.

In this guide, you will download the SI distribution as well as Kafka, and then try out a simple Siddhi application. This Siddhi application consumes messages from a file processes the data, generates an output, and then publishes that output to a Kafka topic.

The following is the outline of this quick start guide.

![Quick Start Guide Outline]({{base_path}}/images/qsg/qsg-outline.png)

## Step 1: Download the Streaming Integrator

Download the Streaming Integrator distribution from [WSO2 Streaming Integrator site](https://wso2.com/integration/streaming-integrator/) and extract it to a location of your choice. Hereafter, the extracted location is referred to as `<SI-Home>`.

## Step 2: Start the Streaming Integrator

To start WSO2 Streaming Integrator, navigate to the `<SI-Home>/bin` directory from the CLI, and issue the appropriate command based on your operating system:

- **For Linux**: `./server.sh`
- **For Windows**: `server.bat --run`

## Step 3: Download Kafka

Download the Kafka broker from [the Apache site](https://archive.apache.org/dist/kafka/2.5.0/kafka_2.12-2.5.0.tgz) and extract it.
This directory is referred to as `<Kafka_Home>` from here on.

## Step 4: Create and deploy a simple Siddhi application

Let's create a simple Siddhi application that reads data from a CSV file, does a simple transformation to the data, and then publishes the results to a Kafka topic so that multiple subscriber applications can have access to that data.

![Scenario]({{base_path}}/images/qsg/quick-start.png)

1. Download `productions.csv` file from [here](https://github.com/wso2/docs-ei/tree/master/en/streaming-integrator/docs/examples/resources/productions.csv) and save it in a location of your choice.

    !!! info
        In this example, the file is located in the `Users/foo`directory.

2. Open a text file and copy-paste the following Siddhi application into it.

    !!! tip
        Here, you are instructed to use a text editor to deploy a Siddhi Application that has already been tested in order to minimize the time you spend to follow this guide. It is recommended to design Siddhi application via Streaming Integration Tooling that offers features such as syntax checking, event simulation for testing purposes, reformatting code, the option to design applications in a graphical interface or by writing code, and many more. For more information, see [Streaming Integrator Tooling Overview](../develop/streaming-integrator-studio-overview.md).

    ```sql
    @App:name('ManageProductionStats')
    @App:description('Receive events via file and publish to Kafka topic')
    
    @source(type = 'file', mode = "LINE", file.uri = "file:/Users/foo/productions.csv", tailing = "true",
        @map(type = 'csv'))
    define stream SweetProductionStream (name string, amount double);
    
    @sink(type = 'kafka', bootstrap.servers = "localhost:9092", topic = "total_production", is.binary.message = "false", partition.no = "0",
        @map(type = 'json'))
    define stream TotalProductionStream (name string, amount double);
    
    -- Simple Siddhi query to calculate production totals.
    @info(name = 'query1')
    from SweetProductionStream 
    select name, sum(amount) as amount 
    group by name
    insert into TotalProductionStream;
    ```

    The above Siddhi application reads input data from a file named `production.csv` in the CSV format, processes it and publishes the resulting output in a Kafka topic named `total_production`. As a result, any application that cannot read streaming data, but is capable of subscribing to a Kafka topic can access the output. The each input event reports the amount of a specific sweet produced in a production run. The Streaming Integrator calculates the total produced of each sweet with each event. Therefore, each output event reports the total amount produced for a sweet from the time you started running the Siddhi application. 

3. Save this file as `ManageProductionStats.siddhi` in the `<SI-Home>/wso2/server/deployment/siddhi-files` directory.

    This deploys the `ManageProductionStats` in the Streaming Integrator. The following message appears to indicate that the Siddhi application is successfully installed.

    `INFO {org.wso2.carbon.siddhi.editor.core.internal.WorkspaceDeployer} - Siddhi App ManageProductionStats.siddhi successfully deployed.`
    
## Step 5: Install the required extensions

The `ManageProductionStats` Siddhi application uses a Kafka sink. However, the Siddhi extension for Kafka is not installed by default. To install it so that the Siddi application can integrate with Kafka as expected, follow the steps below:

1. Navigate to the `<SI-Home>/bin` directory and issue the appropriate command based on your operating system:

    - **For Linux**: `./extension-installer.sh install`
    - **For Windows**: `extension-installer.bat install`
    
    As a result, a message appears in the terminal with a list of extensions used in your Siddhi application that are not completely installed, and requests you to confirm whether the system should proceed to install them
    
    
2. Enter `Y` in the terminal to confirm that you want to proceed to install the required extensions, and then press the return key. Then the following message is displayed to indicate that the extension isinstalled.

    ![Extention Installed]({{base_path}}/images/qsg/extension-installed.png)
    
3. Restart the WSO2 Streaming Integrator server as instructed.


## Step 6: Start Kafka and create a topic

Let's start the Kafka server and create a Kafka topic so that the `ManageProductionStats.siddhi` application you created can publish its output to it.

To start Kafka:

1. Navigate to the `<Kafka_Home>` directory and start a zookeeper node by issuing the following command.

    `sh bin/zookeeper-server-start.sh config/zookeeper.properties`

2. Navigate to the `<Kafka_Home>` directory and start Kafka server node by issuing the following command.

    `sh bin/kafka-server-start.sh config/server.properties`
    
To create a Kafka topic named `total_production`:

1. Navigate to `<Kafka_Home>` directory and issue the following command:

    `bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic total_production`
    

## Step 7: Test your Siddhi application

To test the `ManageProductionStats` Siddhi application you created, follow the steps below.
 
1. Open the `/Users/foo/productions.csv` file and add five rows in it as follows and save your changes.

    ```csv
    Toffee,40.0
    Almond cookie, 70.0
    Baked alaska, 30.0
    Toffee, 60.0
    Baked alaska, 20.0
    ```
2. To observe the messages in the `total_production` topic, navigate to the `<Kafka_Home>` directory and issue the following command:

    `bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic total_production --from-beginning`
    
    
You can see the following message in the Kafka Consumer log. 

```text
{"event":{"name":"Almond cookie","amount":100.0}}
{"event":{"name":"Baked alaska","amount":120.0}}
{"event":{"name":"Toffee","amount":160.0}}
{"event":{"name":"Almond cookie","amount":230.0}}
{"event":{"name":"Baked alaska","amount":260.0}}
{"event":{"name":"Toffee","amount":320.0}}
```


## What's next?

Once you try out this quick start guide, you can proceed to one of the following sections.

- Learn the basic functionality of the Streaming Integrator in less than 30 minutes by [Creating Your First Siddhi Application](getting-started/getting-started-guide-overview.md)

- Try out [Streaming Integrator tutorials](../examples/tutorials-overview.md).

- Learn how to run WSO2 Streaming Integrator in containerized environments, try [Running SI with Docker and Kubernetes](../examples/running-si-with-docker-and-kubernetes.md)
