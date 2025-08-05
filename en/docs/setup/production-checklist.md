# Production Checklist

Once you download and install WSO2 Integrator: SI, you may need to update its default configurations based on your requirements.

The changes that you need to make include the following:

## Providing access

Multiple users with various roles in your organization can require access to your WSO2 Integrator: SI installation to carry out different activities. In order to manage the level of access provided to each user based on their roles, you are required to configure users roles and permissions. For instructions, see [User Management](../admin/user-management.md).

## Securing the WSO2 Integrator: SI

SI is an open-source product. Therefore, anyone who downloads it has access to the default users and passwords, default keystore settings, etc. Therefore, you are required to update the configurations related to security in order to ensure that your data is secure when you run SI in a production environment. For more information, see the following topics:

- WSO2 uses key stores to store cryptographic keys and certificates that are used for various purposes. For more information on how to configure and manage them, see [Working with Keystores](../admin/working-with-Keystores.md).
- To protect sensitive data, see [Protecting Sensitive Data via the Secure Vault](https://ei.docs.wso2.com/en/latest/streaming-integrator/admin/protecting-sensitive-data-via-the-secure-vault/).
- To understand how WSO2 Integrator: SI complies with GDPR(General Data Protection Regulations) and how you can comply with the same when you are using WSO2 Integrator: SI, see [General Data Protection Regulations](../admin/general-data-protection-regulations.md).

## Opening the required ports

This involves configuring the network firewall for opening the ports used by WSO2 Integrator: SI. For more information about the required ports, see [Configuring Default Ports](../ref/configuring-default-ports.md).

## Setting up databases

If you are integrating data stores in your Streaming Integration flows, you need to set up databases. For information about supported database types and how to configure data sources for them, see [Configuring Datasources](configuring-data-sources.md).

## Configuring Transports

In order to use certain transports to receive and send data, you are required to configure them with WSO2 Integrator: SI. For more information, see [Supporting Different Transports](../admin/supporting-different-transports.md).

## Minimizing the impact of system failure

In order to minimize the loss of data that can result from a system failure, you can configure WSO2 Integrator: SI to periodically save its state in a database. For more information, see [Configuring Database and File System State Persistence](../admin/configuring-Database-and-File-System-State-Persistence.md).

## Monitoring the WSO2 Integrator: SI

To monitor the performance of your WSO2 Integrator: SI setup, configure SI to publish its statistics in Dashboards as described in [Configuring Grafana Dashboards](../admin/setting-up-grafana-dashboards.md).




 
