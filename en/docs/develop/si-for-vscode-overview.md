---
tags:
  - siddhi
  - streaming
---

# WSO2 Integrator: SI Overview

WSO2 Integrator: SI provides a comprehensive development environment for designing, developing, debugging, and testing streaming integration solutions using Siddhi applications. This page is a quick tour of what the SI editor experience offers.

!!! info
    See [Install SI](../setup/installing-si-in-vm.md) for a complete installation guide.

## Development at a glance

Developing a WSO2 Integrator: SI solution involves the following five steps.

![WSO2 Integrator: SI Development Flow]({{base_path}}/images/developing-si-solutions/si-development-workflow.png)

| **Step**                                       | **Description**                                                                                                                                                                                                                                                                                                                                                                                |
|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Step 1: Installing the WSO2 Integrator: SI** | Download and install WSO2 Integrator: SI, in which Siddhi applications are designed. For more information, see the following topics:<br/> - [Installing the WSO2 Integrator: SI in a Virtual Machine](../setup/installing-si-in-vm.md)<br/> - [Installing the WSO2 Integrator: SI in Docker](../setup/installing-si-using-docker.md)<br/> - [Installing the WSO2 Integrator: SI in Kubernetes](../setup/installing-si-using-kubernetes.md) |
| **Step 2: Creating Siddhi Applications**       | Siddhi applications can be designed in the WSO2 Integrator: SI editor via the Source View or the Graphical View. For detailed instructions, see [Creating Siddhi Applications](../get-started/first-siddhi-app/create-the-siddhi-application.md).                                                                                                                                                |
| **Step 3: Testing Siddhi Applications**        | Once a Siddhi application is created, you can test it before using it in a production environment by simulating events to it. For more information, see [Testing Siddhi Applications](testing-a-Siddhi-Application.md).                                                                                                                                                                          |
| **Step 4: Deploying Siddhi Applications**      | Once your Siddhi application is created and verified via the testing functionality in the editor, you can deploy it in the WSO2 Integrator: SI server, or deploy it in a Docker/Kubernetes environment. For more information, see [Exporting Siddhi Applications](exporting-Siddhi-Applications.md).                                                                                            |
| **Step 5: Running Siddhi Applications**        | Once deployed, the Siddhi application runs in the SI server. For hands-on practice with end-to-end scenarios, see the [WSO2 Integrator: SI Tutorials](../tutorials/tutorials-overview.md).                                                                                                                                                                                                          |

## Environment Setup

The **Environment Setup** view helps you configure the prerequisites for developing Siddhi applications: Java Development Kit (JDK) and the WSO2 Integrator: SI runtime.

<a href="{{base_path}}/images/si-for-vscode/environment-setup.png"><img src="{{base_path}}/images/si-for-vscode/environment-setup.png" alt="Environment Setup" width="80%"></a>

WSO2 Integrator automatically detects your system configuration after you open a Siddhi application and provides:

- **Java runtime status** — verification and automatic download of compatible JDK versions.
- **SI runtime status** — detection and setup of the WSO2 Integrator: SI runtime.
- **Quick setup buttons** — one-click installation for missing components.

After environment setup is done, the **Welcome View** opens and gives you an overview of the editor.

<a href="{{base_path}}/images/si-for-vscode/welcome-view.png"><img src="{{base_path}}/images/si-for-vscode/welcome-view.png" alt="Welcome View" width="80%"></a>

## Anatomy of a Siddhi application

A Siddhi application is a `.siddhi` file that defines stream-processing logic. Each application consists of the following building blocks:

| Configuration           | Description                                                                                                                                                                                                                                                                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Stream**              | A logical series of events ordered in time, with a uniquely identifiable name and a set of attributes with specific data types defining its schema.                                                                                                                                                                                                                                              |
| **Source**              | Consumes data from external systems (TCP, Kafka, HTTP, etc.) in the form of events, converts each event from its native format (XML, JSON, binary, etc.) to a Siddhi event, and passes it to a stream for processing.                                                                                                                                                                            |
| **Sink**                | Takes events from a stream, maps them to a target data format (XML, JSON, binary, etc.), and publishes them to external endpoints (email, TCP, Kafka, HTTP, etc.).                                                                                                                                                                                                                              |
| **Executional element** | One of:<ul><li>**Stateless query** — only considers currently incoming events when generating output (e.g., filters).</li><li>**Stateful query** — considers both currently incoming events and past events (e.g., windows, sequences, patterns).</li><li>**Partition** — a collection of stream definitions and queries separated for parallel and isolated processing.</li></ul> |

You design these elements either as Siddhi code in the **Source View** or visually in the **Graphical View**.

## Siddhi application development

### Source View

WSO2 Integrator: SI provides a rich code-editing experience for Siddhi applications with comprehensive language support:

<a href="{{base_path}}/images/si-for-vscode/siddhi-editor.png"><img src="{{base_path}}/images/si-for-vscode/siddhi-editor.png" alt="Siddhi Editor" width="80%"></a>

**Key features:**

- **Syntax highlighting** — full syntax highlighting for Siddhi language constructs.
- **IntelliSense** — context-aware auto-completion for streams, functions, and keywords.
- **Error detection** — real-time validation and error highlighting.
- **Code snippets** — pre-built templates for common patterns.

### Graphical View

WSO2 Integrator: SI includes a visual editor that lets you design stream-processing flows by dragging and dropping components.

<a href="{{base_path}}/images/si-for-vscode/graphical-view.png"><img src="{{base_path}}/images/si-for-vscode/graphical-view.png" alt="Graphical View" width="80%"></a>

**Visual editor features:**

- **Tool palette** — drag-and-drop components for streams, queries, sources, and sinks.
- **Design canvas** — visual representation of your stream-processing flow.
- **Properties panel** — configure each component through forms.
- **Bidirectional sync** — changes in the Source View automatically reflect in the Graphical View and vice versa.

To open the Graphical View, click **Open Graphical View** in the editor toolbar when editing a `.siddhi` file.

For a worked example using drag-and-drop, see [Build a Siddhi Application with the Graphical View](build-siddhi-app-with-graphical-view.md). For full reference on every component and form, see [Working with the Graphical View](working-with-the-graphical-view.md).

## Execution and testing

### Running Siddhi applications

You can execute Siddhi applications directly within WSO2 Integrator: SI:

<a href="{{base_path}}/images/si-for-vscode/run-application.png"><img src="{{base_path}}/images/si-for-vscode/run-application.png" alt="Run Application" width="80%"></a>

Click the **Run** button (▶) in the editor toolbar to execute your Siddhi application and view the output in the integrated terminal.

### Event simulation

WSO2 Integrator: SI provides comprehensive event simulation capabilities for testing your stream-processing logic:

<a href="{{base_path}}/images/si-for-vscode/event-simulator.png"><img src="{{base_path}}/images/si-for-vscode/event-simulator.png" alt="Event Simulator" width="80%"></a>

**Simulation options:**

- **Single event simulation** — send individual events to test specific scenarios.
- **Batch event generation** — generate multiple events with configurable patterns.
- **CSV file upload** — use CSV files to simulate realistic data streams.
- **Database integration** — connect to databases for live data simulation.

Open the event simulator by clicking the **Event Simulator** button when your application is running. For details, see [Running and Testing Siddhi Applications](testing-a-Siddhi-Application.md).

## Deployment and extensions

### Docker export

Export your Siddhi applications as containerized solutions for production deployment:

<a href="{{base_path}}/images/si-for-vscode/docker-export.png"><img src="{{base_path}}/images/si-for-vscode/docker-export.png" alt="Docker Export" width="80%"></a>

Use the **SI: Export Siddhi Apps to Docker** command to generate Docker artifacts including a Dockerfile, dependencies, and configuration files. For details, see [Exporting Siddhi Applications as a Docker Artifact](exporting-Siddhi-Applications.md).

### Extension management

The **SI: Extension Installer** command opens a panel where you can browse, install, and uninstall Siddhi extensions for sources, sinks, functions, and analytics capabilities.

<a href="{{base_path}}/images/si-for-vscode/extension-installer.png"><img src="{{base_path}}/images/si-for-vscode/extension-installer.png" alt="Extension Installer" width="80%"></a>

For installation procedures and the full status reference, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).

## Command Palette

WSO2 Integrator: SI commands are accessible through the WSO2 Integrator command palette (`Ctrl + Shift + P` on Windows/Linux, `Cmd + Shift + P` on macOS). Some commands are always available; others appear only when the editor is in the right context.

### Always available

| Command | Description |
| --- | --- |
| **WSO2 Integrator: Open Welcome Page** | Open the WSO2 Integrator welcome page. |
| **SI: Open Graphical View** | Switch to the Graphical View for the current Siddhi application. |
| **SI: Export Siddhi Apps to Docker** | Export your Siddhi applications as a Docker artifact. |
| **SI: Extension Installer** | Open the Extension Installer panel to install or uninstall Siddhi extensions. |
| **SI: Set Java Home** | Configure the path to your JDK installation. |
| **SI: Add SI server** | Register a separately-managed SI server with the editor. |

### Context-dependent

These commands only appear when their precondition holds, which is why they don't always show up in a palette search.

| Command | When it appears |
| --- | --- |
| **SI: Run** | When you're editing a `.siddhi` file and SI isn't already running. Also surfaced as the play button in the editor title bar. |
| **SI: Event Simulator** | When you're editing a `.siddhi` file and SI is currently running. |
| **SI: Show Source** | When the Graphical View is active — toggles back to the Source View. |
| **SI: Refresh Project Explorer** | Only in the Project Explorer view title bar (not the palette). |

!!!info "What's Next?"
    - See [Install SI](../setup/installing-si-in-vm.md) for installation details.
    - See [Step 2: Create the Siddhi Application](../get-started/first-siddhi-app/create-the-siddhi-application.md) to walk through building your first Siddhi application.
    - See [Siddhi Query Guide](https://siddhi.io/) for comprehensive documentation on Siddhi query syntax and patterns.
