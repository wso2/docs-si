<div class="homePage">
    <div class="section01">
        <div class="leftContent">
            <div class="about-home">
                <div>
                    An advanced stream processing engine that understands streaming SQL queries to capture, analyze, and process streaming data, and allows us to integrate and act on event streams in real-time. WSO2 Streaming Integrator allows you to connect any data source to any destination with its 60+ prebuilt, production-grade connectors. It comes with a web-based IDE for designing, developing, testing, and deploying stream processing applications with a graphical drag-and-drop experience or by writing streaming SQL queries.
                </div>
                <div>
                    <a href="https://wso2.com/streaming-integrator/" class="banner-link"></a>
                </div>
            </div>
        </div>
    </div>
    <div class="section02">
        <div class="linkWrapper">
            <div class="linkSet2" onclick="location.href='{{base_path}}quick-start-guide/quick-start-guide/';">
                <a href="quick-start-guide/quick-start-guide/"><h3>Quick Start Guide</h3></a>
                <p>
                    Let's get started with WSO2 Streaming Integrator by running a simple integration use case in your local environment.
                </p>
            </div>
        </div>
    </div>
    <div class="section03">
        <h3>What can WSO2 Streaming Integrator do?</h3>
        <div class="linkWrapper">
            <div class="linkSet3" onclick="location.href='{{base_path}}/guides/extracting-data-from-static-sources-in-real-time/';">
                <a href="guides/extracting-data-from-static-sources-in-real-time/"><h3>Streaming ETL with CDC</h3></a>
                <p>
                    Treats data sources as streams, supports Debezium-based CDC, offers a wizard-based ETL designer, error handling, integrations with multiple systems, and provides hierarchical monitoring dashboards.
                </p>
            </div>
            <div class="linkSet3 middle" onclick="location.href='{{base_path}}/guides/loading-and-writing-date/';">
                <a href="guides/loading-and-writing-date/"><h3>Loading and Writing Data</h3></a>
                <p>
                    Enable loading, processing, and writing data in multiple formats to databases, files, and cloud storages for further processing in complex enterprise scenarios.
                </p>
            </div>
            <div class="linkSet3 last" onclick="location.href='{{base_path}}/guides/processing-data/';">
                <a href="guides/processing-data/"><h3>Stream Processing</h3></a>
                <p>
                    Offers built-in connectors for various event sources and sinks, ensures at-least-once delivery with exactly-once processing, and supports transforming, enriching, cleansing, aggregating, and correlating event streams for insights.
                </p>
            </div>
        </div>
    </div>
<div class="section04">
        <div class="linkWrapper">
            <div class="linkSet4 middle" onclick="location.href='{{base_path}}/develop/streaming-integrator-studio-overview';">
                <a href="develop/streaming-integrator-studio-overview"><h3>Visual Tooling</h3></a>
                <p>
                    Provides capabilities to design, develop, test, and deploy streaming integration flows with a drag-and-drop flow designer, event and feed simulation, and configurable connectors for integrating various event sources and sinks.
                </p>
            </div>
            <div class="linkSet4 last" onclick="location.href='{{base_path}}/{{base_path}}/admin/monitoring-si-performance-via-grafana/';">
                <a href="admin/monitoring-si-performance-via-grafana/"><h3>Monitoring</h3></a>
                <p>
                    Offers monitoring metrics for CDC, file, and database interactions. Provide real-time insights into performance, usage, and errors, along with built-in chart visualizations.
                </p>
            </div>
            <div class="linkSet4" onclick="location.href='{{base_path}}/guides/handling-errors/';">
                <a href="guides/handling-errors/"><h3>Handling Errors</h3></a>
                <p>
                   Enable handling of errors that may occur when processing streaming data in a graceful manner.
                </p>
            </div>
        </div>
    </div>
</div>
{% raw %}
<style>
.md-sidebar.md-sidebar--primary {
    display: none;
}
.md-sidebar.md-sidebar--secondary{
    display: none;
}
.section02 {
    display: flex;
    justify-content: space-between;
}
header.md-header .md-header__button:not([hidden]) {
    /* display: none; */
}
.about-home {
    display: flex;
    align-items: center;
}
.about-home div:first-child {
    width: 50%;
    padding-top: 20px;
}
.about-home div:nth-child(2) {
    width: 50%;
}
@media screen and (max-width: 76.1875em) {
    .md-sidebar.md-sidebar--primary {
        display: block;
    }
}
@media screen and (max-width: 945px) {
    .about-home div:first-child {
        width: 100%;
    }
    .about-home div:nth-child(2) {
        width: 100%;
    }
    .about-home {
        flex-direction: column;
    }
    .md-typeset a {
        background-position-x: left;
    }
    .download-btn-wrapper {
        display: block;
        text-align: center;
    }
}
.md-typeset h1{
    visibility: hidden;
    margin-bottom: 0;
}
.md-search-result__article.md-typeset h1{
    visibility: visible;
}
</style>
{% endraw %}