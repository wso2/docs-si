---
tags:
  - vscode
  - extension
  - streaming
  - siddhi
---

# WSO2 Integrator: SI for VS Code Overview

WSO2 Integrator: SI offers an extension for Visual Studio Code (VS Code) that provides a comprehensive development environment for designing, developing, debugging, and testing streaming integration solutions using Siddhi applications.

This page provides a quick overview of the interface of the SI for VS Code extension.

!!! info
    See [Install Streaming Integrator for VS Code]({{base_path}}/develop/install-si-for-vscode/) for a complete installation guide of the SI for VS Code extension.

To get started, you need to first ensure that the required prerequisites (Java and WSO2 SI runtime) are properly configured. The extension will automatically detect and guide you through the setup process when you open a Siddhi application after installing the extension for the first time. You can then create a new Siddhi application by selecting **Create New Siddhi Application** or explore the provided samples that demonstrate common streaming integration patterns.

## Environment Setup

The **Environment Setup** view helps you configure the necessary prerequisites for developing Siddhi applications. This includes Java Development Kit (JDK) and WSO2 Streaming Integrator runtime.

<a href="{{base_path}}/images/si-for-vscode/environment-setup.png"><img src="{{base_path}}/images/si-for-vscode/environment-setup.png" alt="Environment Setup" width="80%"></a>

The extension automatically detects your system configuration after opening a Siddhi application and provides:

- **Java Runtime Status**: Verification and automatic download of compatible JDK versions
- **SI Runtime Status**: Detection and setup of WSO2 Streaming Integrator
- **Quick Setup Buttons**: One-click installation for missing components

After the environment setup is done, you'll see the **Welcome View** that gives you an overview of the extension.

<a href="{{base_path}}/images/si-for-vscode/welcome-view.png"><img src="{{base_path}}/images/si-for-vscode/welcome-view.png" alt="Welcome View" width="80%"></a>

## Siddhi Application Development

### Code Editor

The SI extension provides a rich code editing experience for Siddhi applications with comprehensive language support:

<a href="{{base_path}}/images/si-for-vscode/siddhi-editor.png"><img src="{{base_path}}/images/si-for-vscode/siddhi-editor.png" alt="Siddhi Editor" width="80%"></a>

**Key Features:**

- **Syntax Highlighting**: Full syntax highlighting for Siddhi language constructs
- **IntelliSense**: Context-aware auto-completion for streams, functions, and keywords
- **Error Detection**: Real-time validation and error highlighting
- **Code Snippets**: Pre-built templates for common patterns

### Graphical Design View

The extension includes a powerful visual editor that allows you to design stream processing flows using a drag-and-drop interface:

<a href="{{base_path}}/images/si-for-vscode/graphical-view.png"><img src="{{base_path}}/images/si-for-vscode/graphical-view.png" alt="Graphical Design View" width="80%"></a>

**Visual Editor Features:**

- **Tool Palette**: Drag-and-drop components for streams, queries, sources, and sinks
- **Design Canvas**: Visual representation of your stream processing flow
- **Properties Panel**: Configure component properties through forms
- **Bidirectional Sync**: Changes in code automatically reflect in the visual view and vice versa

To access the graphical view, click the **Open Graphical View** button in the editor toolbar when editing a `.siddhi` file.

## Execution and Testing

### Running Siddhi Applications

You can execute Siddhi applications directly within VS Code:

<a href="{{base_path}}/images/si-for-vscode/run-application.png"><img src="{{base_path}}/images/si-for-vscode/run-application.png" alt="Run Application" width="80%"></a>

Click the **Run** button (▶️) in the editor toolbar to execute your Siddhi application and view the output in the integrated terminal.

### Event Simulation

The extension provides comprehensive event simulation capabilities for testing your stream processing logic:

<a href="{{base_path}}/images/si-for-vscode/event-simulator.png"><img src="{{base_path}}/images/si-for-vscode/event-simulator.png" alt="Event Simulator" width="80%"></a>

**Simulation Options:**

- **Single Event Simulation**: Send individual events to test specific scenarios
- **Batch Event Generation**: Generate multiple events with configurable patterns
- **CSV File Upload**: Use CSV files to simulate realistic data streams
- **Database Integration**: Connect to databases for live data simulation

Access the event simulator by clicking the **Event Simulator** button (🧪) when your application is running.

## Deployment and Extensions

### Docker Export

Export your Siddhi applications as containerized solutions for production deployment:

<a href="{{base_path}}/assets/images/si-for-vscode/docker-export.png"><img src="{{base_path}}/images/si-for-vscode/docker-export.png" alt="Docker Export" width="80%"></a>

Use the **SI: Export Siddhi Apps to Docker** command to generate Docker artifacts including Dockerfile, dependencies, and configuration files.

### Extension Management

The **SI: Extension Installer** command allows you to browse, install, and manage Siddhi extensions for sources, sinks, functions, and analytics capabilities.

<a href="{{base_path}}/images/si-for-vscode/extension-installer.png"><img src="{{base_path}}/images/si-for-vscode/extension-installer.png" alt="Extension Installer" width="80%"></a>

## Command Palette Integration

All SI extension features are accessible through the VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- **SI: Open SI Welcome** - Access the welcome screen
- **SI: Open Graphical View** - Switch to visual design mode
- **SI: Export Siddhi Apps to Docker** - Export for containerized deployment
- **SI: Extension Installer** - Manage Siddhi extensions
- **SI: Set Java Home** - Configure Java installation path
- **SI: Add SI Server** - Configure SI runtime path

!!!info "What's Next?"
    - See [Install SI for VS Code]({{base_path}}/develop/install-si-for-vscode) for more information on how to install and set up SI for VS Code.
    - See [Create a Siddhi Application]({{base_path}}/develop/creating-a-Siddhi-Application/) for more information on how to create streaming integration solutions.
    - See [Siddhi Query Guide](https://siddhi.io/) for comprehensive documentation on Siddhi query syntax and patterns.
