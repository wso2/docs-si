# Step 1: Set up your environment and dependencies

First, you are required to set up WSO2 Integrator: SI and the other software needed for the scenario you are trying out. To do this, follow the topics below.

!!! tip "Before you begin:"
    - Install [Oracle Java SE Development Kit (JDK) version 21](https://www.oracle.com/java/technologies/downloads/).<br/>
    - [Set the Java home](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) environment variable.<br/>

## Setting up WSO2 Integrator: SI

1. Download WSO2 Integrator from the [WSO2 Integrator downloads page](https://wso2.com/products/downloads/?product=wso2integrator). Enter your email address and agree to the license — you will receive an email with a link to download the installer.

2. Run the installer and open WSO2 Integrator. From the home page, click **Configure** in the top right corner, and under **Select your Integration Profile**, choose **WSO2 Integrator: SI**.

3. WSO2 Integrator opens the SI setup page. If Java 21 or the SI runtime is not detected, click **Download Java & SI** to install both automatically. If you already have Java 21 or the SI runtime installed, expand **Advanced Options** to point WSO2 Integrator at your existing `JAVA_HOME` and SI installation directory.

    !!! note
        After installation, WSO2 Integrator places the SI runtime in `~/.wso2-si/streaming-integrator/wso2si-<VERSION>/` (a hidden folder in your home directory). This is referred to as `<SI_HOME>` throughout the rest of this guide. For more on managing the SI runtime directly, see [Install SI in a VM](../../setup/installing-si-in-vm.md).

## Downloading the other dependencies for your scenario

This section shows how to prepare your production environment for the scenario described in the [Streaming Integration Overview section](overview.md).

## Setting up a MySQL database table

!!! note "macOS users"
    The MySQL DMG installer does not add the `mysql` client to `PATH`. Either invoke the full path (`/usr/local/mysql/bin/mysql -u root -p`) or add `/usr/local/mysql/bin` to `PATH` (e.g., `echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`). Start and stop the MySQL server itself from **System Settings → MySQL**.

In this scenario, the WSO2 Integrator: SI reads input data from a MySQL database table. Therefore, let's download and install MySQL and define the database and database table as follows:

1. Download MySQL 8.3.0 from [MySQL Community Downloads](https://downloads.mysql.com/archives/community/).

2. Verify that binary logging is enabled in the MySQL server. In MySQL 8.0 and later (including the 8.3.0 release used in this guide), binary logging is enabled by default. To confirm, open the MySQL client (`mysql -u root -p`) and run the following query:

    ```sql
    SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
    FROM performance_schema.global_variables WHERE variable_name='log_bin';
    ```

    The status should return `ON`. If binary logging has been disabled, see [Debezium documentation - Enabling the binlog](https://debezium.io/documentation/reference/stable/connectors/mysql.html#enable-mysql-binlog) for instructions.

3. Once you install MySQL and start the MySQL server, create the database and the database table you require as follows:

    1. Let's create a new database in the MySQL server which you are to use throughout this tutorial. To do this, execute the following query:

        ```sql
        CREATE SCHEMA production;
        ```

    2. Create a new user by executing the following SQL queries. The `WITH mysql_native_password` clause is required for the CDC source to connect on MySQL 8.0 and later — it avoids the default `caching_sha2_password` plugin, which Debezium's embedded JDBC driver cannot negotiate over a plain connection:

        ```sql
        CREATE USER 'wso2si'@'localhost' IDENTIFIED WITH mysql_native_password BY 'wso2';
        GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'wso2si'@'localhost';
        ```

    3. Switch to the `production` database and create a new table, by executing the following queries:

        ```sql
        use production;
        CREATE TABLE SweetProductionTable (name VARCHAR(20),amount double(10,2));
        ```

## Adding the MySQL JDBC driver

WSO2 Integrator: SI does not ship with a MySQL JDBC driver. Any tutorial that uses an `@Store(type='rdbms')` against MySQL — or a CDC source against MySQL — needs Connector/J on the SI classpath. To add it:

1. Download the latest **Platform Independent** Connector/J 8.x release from [MySQL Community Downloads — Connector/J](https://dev.mysql.com/downloads/connector/j/).

2. Extract the archive and copy the Connector/J JAR into the `<SI_HOME>/lib/` directory.

3. Restart the WSO2 Integrator: SI server for the driver to be picked up.

When you reference this driver from a Siddhi `@Store` definition, use `com.mysql.cj.jdbc.Driver` as the `jdbc.driver.name` value — this is the canonical class for Connector/J 8.x. The legacy `com.mysql.jdbc.Driver` class still works as a deprecation shim, but new applications should use the modern class.

## Download Kafka and create topics

This scenario involves publishing some filtered production data to a Kafka topic named `eclair-production`.

1. Download the Kafka broker from [the Apache site](https://archive.apache.org/dist/kafka/2.5.0/kafka_2.12-2.5.0.tgz) and extract it.
   This directory is referred to as `<KAFKA_HOME>` from here on.

2. Start Kafka as follows:

    1. First, start a zoo keeper node. To do this, navigate to the `<KAFKA_HOME>` directory and issue the following command:

        ```sh
        sh bin/zookeeper-server-start.sh config/zookeeper.properties
        ```

    2. Next, start a Kafka server node. To do this, issue the following command from the same directory:

        ```sh
        sh bin/kafka-server-start.sh config/server.properties
        ```

    3. To create a Kafka topic named `eclair-production`, issue the following command from the same directory:

        ```sh
        bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic eclair-production
        ```

## Creating a data directory

Several steps in this guide read and write files from a local directory on your machine. Create a directory where your Siddhi applications can access input and output files. For example:

```sh
mkdir -p /Users/<your-username>/siddhi-data
```

This directory is referred to as `<YOUR_HOME>` from here on. Wherever `<YOUR_HOME>` appears in this guide, substitute the directory you just created. Make sure this directory exists before you run any Siddhi application — if it does not, the file sink enters a retry loop and drops events with an error similar to `Dropping event at Sink 'file' at '...' as its still trying to reconnect!`.

## Starting the WSO2 Integrator: SI server

WSO2 Integrator starts the SI runtime automatically when you click the **Run** button on a Siddhi application, so you can rely on this throughout the rest of this guide.

If you would rather drive the server from a terminal (for example, to monitor server logs in real time), navigate to the `<SI_HOME>/bin` directory from the CLI and issue the appropriate command based on your operating system:

=== "On macOS/Linux"
    ```sh
    ./server.sh
    ```
=== "On Windows"
    ```sh
    server.bat --run
    ```

Now you have completed a WSO2 Integrator: SI setup that is capable of the following:

- Designing, testing, and deploying Siddhi applications in **WSO2 Integrator: SI**.

- Consuming data from and publishing data to MySQL databases.

- Consuming data from and publishing data to Kafka topics.


!!! tip "What's Next?"
    To design a Siddhi application, proceed to [Step 2: Create the Siddhi Application](create-the-siddhi-application.md).
