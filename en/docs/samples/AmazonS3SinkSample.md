# Publishing Aggregated Events to the Amazon AWS S3 Bucket

## Purpose

This application demonstrates how to publish aggregated events to Amazon AWS S3 bucket via the [siddhi-io-s3 sink](https://siddhi-io.github.io/siddhi-io-s3/) extension. In this sample the events received to the `StockQuoteStream` stream are aggregated by the
`StockQuoteWindow` window, and then published to the Amazon S3 bucket specified via the `bucket.name` parameter.

!!!info "Before you begin:"
    - Create an AWS account and set the credentials following the instructions in the [AWS Developer Guide](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html).
    - Save the sample Siddhi application in WSO2 Integrator: SI Tooling.

## Prerequisites

1. Download the following files.
    - `woodstox-core-7.1.0.jar`
    - `woodstox-osgi-3.2.1.1.jar`
2. Navigate to {SI-Home}/bin and issue the following command to convert the `woodstox-osgi-3.2.1.1.jar` to OSGi Bundle.
    - For Linux: `./jartobundle.sh <source-path> <destination-path>`
    - For Windows: `./jartobundle.bat <source-path> <destination-path>`
3. Copy the above two bundles to the `<SI-Tooling-Home>/lib` directory.

## Executing the Sample

To execute the sample, follow the procedure below:

1. In WSO2 Integrator: SI Tooling, click Open and then click **AmazonS3SinkSample.siddhi** in the **workspace** directory. Then update it as follows:

    1. Enter the credential.provider class name as the value for the `credential.provider` parameter. If the class is not specified, the default credential provider chain is used.

    2. Update the value of the `bucket.name` parameter in the `sink` annotation. This refers to the name of the Amazon S3 bucket.

    3. Insert the value for the `aws.region` parameter.

    4. Save the Siddhi application.

2. Start the Siddhi application by clicking the **Start** button (shown below) or by clicking by clicking **Run** => **Run**.

    If the Siddhi application starts successfully, the following message appears in the console.

    `AmazonS3SinkSample.siddhi - Started Successfully!.`

## Testing the Sample

To test the sample Siddhi application, simulate random events for it via the WSO2 Integrator: SI Tooling as follows:

1. To open the Event Simulator, click the **Event Simulator** icon.

2. In the Event Simulator panel, click **Feed Simulation** -> **Create**.

        ![Feed Simulation tab]({{base_path}}/images/aggregate-over-time-sample/feed-simulation-tab.png)

3. In the new panel that opens, enter information as follows.

    ![Feed Simulation]({{base_path}}/images/amazon-s3-sink-sample/AmazonS3SinkSample-feed-simulation.png)

    1. In the **Simulation Name** field, enter `AmazonS3SinkSample` as the name for the simulation.
    2. Select **Random** as the simulation source and then click **Add Simulation Source**.
    3. In the **Siddhi App Name** field, select **AmazonS3SinkSample**.
    4. In the **Stream Name** field, select **StockQuoteStream**.
    5. In the **symbol(STRING)** field, select **Regex based**. Then in the **Pattern** field that appears, enter `(IBM|WSO2|Dell)` as the pattern.

        !!!tip
            When you use the `(IBM|WSO2|Dell)` pattern, only `IBM`, `WSO2`, and `Dell` are selected as values for the `symbol` attribute of the `StockQuoteStream`. Using a few values for the `symbol` attribute is helpful when you verify the output because the output is grouped by the symbol.

    6. In the **price(DOUBLE)** field, select **Static value**.

    7. In the **quantity(INT)** field, select **Primitive based**.

    8. Save the simulator configuration by clicking **Save**. Th.e simulation is added to the list of saved feed simulations as shown below.

        ![saved simulation]({{base_path}}/images/amazon-s3-sink-sample/simulation-list.png)

4. To simulate random events, click the **Start** button next to the **AmazonS3SinkSample** simulator.

## Viewing results

Once the events are sent, check the S3 bucket. Objects are created with 3 events in each.

```sql
@App:name("AmazonS3SinkSample")
@App:description("Publish events to Amazon AWS S3")

define window StockQuoteWindow(symbol string, price double, quantity int) lengthBatch(3) output all events;

define stream StockQuoteStream(symbol string, price double, quantity int);

@sink(type='s3', bucket.name='<bucket-name>', object.path='stocks', aws.region='<aws-region>',
        credential.provider='com.amazonaws.auth.profile.ProfileCredentialsProvider', node.id='zeus',
    @map(type='json', enclosing.element='$.stocks',
        @payload("""{"symbol": "{{symbol}}", "price": "{{price}}", "quantity": "{{quantity}}"}""")))
define stream StorageOutputStream (symbol string, price double, quantity int);

from StockQuoteStream
insert into StockQuoteWindow;

from StockQuoteWindow
select *
insert into StorageOutputStream;
```
