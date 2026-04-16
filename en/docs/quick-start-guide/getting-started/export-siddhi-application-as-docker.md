# Step 7: Export the Siddhi Application as a Docker Artifact

Once you have completed Steps 1–6, you can optionally export your Siddhi application as a Docker artifact for containerized deployment. Follow the procedure below.

## Exporting the Siddhi application as a Docker artifact

To export the `SweetFactoryApp` Siddhi application as a Docker artifact, follow the procedure below:

1. Open VSCode in the directory where your Siddhi application is located.

2. Open the command palette by pressing `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS), and type **SI: Export Siddhi Apps to Docker**. Select this command.

    ![Export to Server Docker Option]({{base_path}}/images/quick-start-guide-101/export-to-docker.png)

    The Siddhi App selection dialog box opens as follows.

    ![Export Siddhi Apps to Docker]({{base_path}}/images/quick-start-guide-101/export-to-docker-file-selector.png)

    Select the Siddhi application(s) you want to include and click **OK**.

3. Enter the Docker image name.

    ![Docker Image Name]({{base_path}}/images/quick-start-guide-101/export-to-docker-image-name.png)

4. Select the JAR files of Siddhi extensions that you want to include in the Docker image. If you do not select any JAR files, the default Siddhi extensions are included.

    ![Select Siddhi Extensions]({{base_path}}/images/quick-start-guide-101/export-to-docker-jar-selector.png)

5. Select the bundles from the bundles directory that you want to include in the Docker image.

    ![Select bundles from bundles directory]({{base_path}}/images/quick-start-guide-101/export-to-docker-bundle-selector.png)

6. Provide the export file name.

    ![Export File Name]({{base_path}}/images/quick-start-guide-101/export-to-docker-file-name.png)

7. Once completed, a zip will be created in the workspace directory with the following structure:

    ```
    .
    ├── Dockerfile
    ├── README.md
    └── siddhi-files
        ├── <SIDDHI_FILE>.siddhi
        ├── ...
        └── <SIDDHI_FILE>.siddhi
    ```
