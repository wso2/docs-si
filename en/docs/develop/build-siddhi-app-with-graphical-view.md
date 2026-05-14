# Build a Siddhi Application with the Graphical View

This tutorial walks you through building a simple Siddhi application visually using the **Graphical View** in WSO2 Integrator: SI. The application listens for production events over TCP, computes a running total of production amounts per product, and publishes the result to the console as JSON.

For full reference on every component, form field, and configuration available in the Graphical View, see [Working with the Graphical View](working-with-the-graphical-view.md).

## Open WSO2 Integrator: SI and create a new project

1. Open WSO2 Integrator. Open the command palette by pressing `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS), type `WSO2 Integrator: Open Welcome Page`, and select it.

2. On the welcome page, click **Configure** in the top right corner and select **WSO2 Integrator: SI** under **Select your Integration Profile** (if you have not already done so).

3. Create a new project. A new `.siddhi` file opens for you to work in.

    ![New Siddhi File]({{base_path}}/images/Creating-Siddhi-Applications/New_Siddhi_File.png)

4. To switch to the Graphical View, click the **Open Graphical View** button in the editor toolbar.

## Define the input stream

To define the stream into which the events to be processed by the Siddhi application should be received, drag and drop the stream icon (shown below) onto the grid.

![Stream Icon]({{base_path}}/images/Creating-Siddhi-Applications/Stream_Icon.png)

Once the stream component is added to the grid, move the cursor over it and click the settings icon as shown below.

![Stream Settings]({{base_path}}/images/Creating-Siddhi-Applications/Stream_Settings.png)

The **Stream Configuration** form opens.

![Stream Configuration form]({{base_path}}/images/Creating-Siddhi-Applications/Stream_Configuration_Form.png)

Fill the form as follows to define a stream named `SweetProductionStream` with two attributes named `name` and `amount`:

1. In the **Name** field, enter `SweetProductionStream`.
2. In the **Attributes** table, enter two attributes as follows. Click **+Attribute** to add a new row.

    | Attribute Name | Attribute Type |
    |----------------|----------------|
    | `name`         | `string`       |
    | `amount`       | `double`       |

3. Click **Submit** to save the new stream definition. The stream is displayed on the grid with the `SweetProductionStream` label.

    ![New stream added to the grid]({{base_path}}/images/Creating-Siddhi-Applications/Stream_Component.png)

## Define the output stream

Drag and drop the stream icon again to define the stream that the processed events will be directed to. Place it after the `SweetProductionStream` stream. Configure this stream as follows:

- **Name:** `ProductionAlertStream`
- **Attributes:**

    | Attribute Name      | Attribute Type |
    |---------------------|----------------|
    | `name`              | `string`       |
    | `totalProduction`   | `long`         |

## Add the source

To add the source from which events are received, drag and drop the source icon (shown below) onto the grid. The source is an input to the `SweetProductionStream` input stream component, so place this source component to the left of the input stream component.

![Source Icon]({{base_path}}/images/Creating-Siddhi-Applications/Source_Icon.png)

Once you add the source component, draw a line from it to the `SweetProductionStream` input stream component by dragging the cursor as demonstrated below.

![Connect source]({{base_path}}/images/Creating-Siddhi-Applications/Connect-Source-Component.gif)

Click the settings icon on the source component to open the **Source Configuration** form. Then enter information as follows:

![Source Configuration form]({{base_path}}/images/Creating-Siddhi-Applications/Source_Configuration.png)

1. In the **Source Type** field, select **tcp**.
2. In this example, events are received in the `binary` format. To indicate that events are expected to be converted from this format, select **binary** in the **Map Type** field.
3. To indicate the context, select the **context** check box and enter `SweetProductionData` in the field that appears below.
4. Click **Submit**.

## Add the projection query

To add a query that defines the execution logic, drag and drop the projection query icon (shown below) onto the grid.

![Projection Query Icon]({{base_path}}/images/Creating-Siddhi-Applications/Projection_Query_Icon.png)

The query uses the events in the `SweetProductionStream` input stream as inputs and directs the processed events to the `ProductionAlertStream` output stream. Create two connections as demonstrated below.

![Connecting the projection query]({{base_path}}/images/Creating-Siddhi-Applications/Connect-Projection-Query.gif)

To define the execution logic, move the cursor over the query in the grid, click the settings icon, and configure as follows:

![Configuring the projection query]({{base_path}}/images/Creating-Siddhi-Applications/Projection-Query-Configuration.png)

1. Enter a name for the query in the **Name** field. Use `query`.
2. To specify how each input stream attribute is converted to generate the output events, select **User Defined Attributes** in the **Select** field. The **User Defined Attributes** table appears, with the **As** column listing the output stream attributes. Enter expressions in the `Expression` column:
    1. The value for `name` can be derived from the input stream without any further processing. Enter `name` as the expression.
    2. To derive the value for `totalProduction`, the values for `amount` need to be summed. Enter `sum(amount)` as the expression.
    3. Leave the default values of the **Output** section unchanged.
3. Click **Submit**.

## Add the sink

To add a sink that publishes the output events directed to the `ProductionAlertStream` output stream, drag and drop the sink icon (shown below) onto the grid.

![Sink icon]({{base_path}}/images/Creating-Siddhi-Applications/Sink_Icon.png)

Draw an arrow from the `ProductionAlertStream` output stream to the sink component to connect them.

Click the settings icon on the sink component to open the **Sink Configuration** form. Then:

![Configuring the sink]({{base_path}}/images/Creating-Siddhi-Applications/Sink_Configuration.png)

1. To publish output as logs in the console, select `log` in the **Sink Type** field.
2. In the **Map Type** field, select the format. For this example, select `json`.
3. Click **Submit**.

## Save the Siddhi application

Click **Show Source** to switch back to the Source View. The Siddhi application is displayed as follows.

![Source view]({{base_path}}/images/Creating-Siddhi-Applications/Siddhi_Application_Source_View.png)

To save this Siddhi application, click **File → Save**.

!!! tip "What's Next?"
    - For full reference on every Graphical View component and form, see [Working with the Graphical View](working-with-the-graphical-view.md).
    - To run and test your Siddhi application, see [Running and Testing Siddhi Applications](testing-a-Siddhi-Application.md).
