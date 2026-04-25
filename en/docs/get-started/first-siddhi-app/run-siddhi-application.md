# Step 4: Run the Siddhi Application

In this step, let's verify the `SweetFactoryApp` Siddhi application end-to-end by inserting a real record into the MySQL `production` database and observing the corresponding output in the file sink.

If you closed the `SweetFactoryApp` Siddhi application after Step 2, open the `SweetFactoryApp.siddhi` file in WSO2 Integrator: SI and click the **Run** button (▶) in the toolbar to redeploy and start it.

## Generating an input event

To generate an input event, insert a record in the `production` database table by issuing the following command in the MySQL console:

```sql
insert into SweetProductionTable values('chocolate',100.0);
```

Then open the `<YOUR_HOME>/productioninserts.csv` file. The following record should be displayed.

![Updated File]({{base_path}}/images/quick-start-guide-101/updated-file.png)

!!! tip "What's Next?"
    Now you can try extending the `SweetFactoryApp` Siddhi application to perform more streaming integration activities. To try this, proceed to [Step 5: Update the Siddhi Application](update-the-siddhi-application.md).
