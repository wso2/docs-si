{% set tiles = [
    [{
        "title": "Get Started",
        "icon": "🚀",
        "links": [
            {"name": "Introduction", "url": "overview/overview/"},
            {"name": "Quick Start Guide", "url": "quick-start-guide/quick-start-guide/"},
            {"name": "Install WSO2 Integrator: SI", "url": "setup/installing-si-in-vm/"},
            {"name": "Create Your First Siddhi Application", "url": "quick-start-guide/getting-started/getting-started-guide-overview/"},
            {"name": "Architecture", "url": "overview/architecture/"},
            {"name": "Key Concepts", "url": "concepts/concepts/"}
        ]
    },
    {
        "title": "Setup and Install",
        "icon": "⏬",
        "links": [
            {"name": "Install WSO2 Integrator: SI", "url": "setup/installing-si-in-vm/"},
            {"name": "Install in Docker", "url": "setup/installing-si-using-docker/"},
            {"name": "Install in Kubernetes", "url": "setup/installing-si-using-kubernetes/"}
        ]
    },
    ],
    [
    {
        "title": "Tutorials",
        "icon": "📚",
        "links": [
            {"name": "Performing Real-time ETL", "url": "examples/performing-real-time-etl-with-files/"},
            {"name": "Working with Kafka", "url": "examples/working-with-kafka/"},
            {"name": "Exposing Processed Data as API", "url": "examples/exposing-processed-data-as-api/"},
            {"name": "Triggering Integration Flows via WSO2 Integrator: MI", "url": "examples/triggering-integrations-via-micro-integrator/"},
            {"name": "Running in Containerized Environments", "url": "examples/running-si-with-docker-and-kubernetes/"},
            {"name": "Managing Streaming Data with Errors", "url": "examples/handling-requests-with-errors/"}
        ]
    },
    {
        "title": "Connectors",
        "icon": "🛠️",
        "links": [
            {"name": "WSO2 Integrator: SI Connectors Overview", "url": "connectors/connectors-overview/"},
            {"name": "Downloading and Installing Siddhi Extensions", "url": "connectors/downloading-and-Installing-Siddhi-Extensions/"},
            {"name": "Writing Custom Siddhi Extensions", "url": "connectors/writing-Custom-Siddhi-Extensions/"},
            {"name": "Configuring System Parameters for Siddhi Extensions", "url": "connectors/configuring-System-Parameters-for-Siddhi-Extensions/"}
        ]
    }
    ],
    [
    {
        "title": "Observability and Monitoring",
        "icon": "📈",
        "links": [
            {"name": "Monitoring with WSO2 Integrator: ICP", "url": "admin/working-with-integration-control-plane/"},
            {"name": "Monitoring with Grafana", "url": "admin/monitoring-si-performance-via-grafana/"},
            {"name": "Monitoring ETL Flows with Grafana", "url": "admin/viewing-dashboards/"}
        ]
    },
    {
        "title": "References",
        "icon": "📖",
        "links": [
            {"name": "Environment Compatibility", "url": "ref/environment-compatibility/"},
            {"name": "REST API Guide Overview", "url": "ref/rest-api-guide-overview/"},
            {"name": "Performance Analysis Results", "url": "ref/performance-analysis-results/"}
        ]
    },
    {
        "title": "Community & Support",
        "icon": "❓",
        "links": [
            {"name": "GitHub", "url": "https://github.com/wso2/product-streaming-integrator/issues"},
            {"name": "Discord", "url": "https://discord.com/invite/wso2"},
            {"name": "Enterprise Support", "url": "https://wso2.com/subscription/"}
        ]
    }
    ]
] %}
<div class="homePage">
    <div class="description-section">
        <div>
            An advanced stream processing engine that understands streaming SQL queries to capture, analyze, and process streaming data, and allows us to integrate and act on event streams in real-time. WSO2 Integrator: SI allows you to connect any data source to any destination with its 60+ prebuilt, production-grade connectors. It comes with the <a href="TODO:insert link to marketplace">WSO2 Integrator: SI</a> extension for Visual Studio Code (VS Code) for designing, developing, testing, and deploying stream processing applications with a graphical drag-and-drop experience or by writing streaming SQL queries.
        </div>
        <div>
            <a href="https://wso2.com/streaming-integrator/" class="banner-link"></a>
        </div>
    </div>
    <div class="section02">
        <div class="tiles-container">
            {% for column in tiles %}
            <div class="tiles-column">
                {% for tile in column %}
                <div class="tile">
                    <div class="tile-header">
                        <h3>{{ tile.title }}</h3>
                        <span class="tile-icon">{{ tile.icon }}</span>
                    </div>
                    <ul class="links-list">
                        {% for link in tile.links %}
                        <li>
                            {% if tile.title == "Community & Support" %}
                                <a href="{{ link.url }}" target="_blank" class="link">{{ link.name }}</a>
                            {% else %}
                                <a href="{{ base_path }}/{{ link.url }}" class="link">{{ link.name }}</a>
                            {% endif %}
                        </li>
                        {% endfor %}
                    </ul>
                    {% if tile.more_btn %}
                    <div class="button-container">
                        <a href="{{base_path}}/{{ tile.more_btn.url }}" class="view-all-button">{{ tile.more_btn.name }}</a>
                    </div>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
            {% endfor %}
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
    justify-content: center;
    /* background: linear-gradient(100deg, #fff9ee, #ffffff); */
}
header.md-header .md-header__button:not([hidden]) {
    /* display: none; */
}
.about-home {
    display: flex;
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
.description-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    margin-left: 100px;
}
.tiles-container {
    display: flex;
    align-items: start;
}
.tile {
    display: inline-block;
    vertical-align: top;
    background-color: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease-in-out;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0 0 25px 25px;
}
.tile:hover {
    transform: scale(1.01);
}
.tile-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(215, 215, 215);
}
.tile h3 {
    font-size: 0.9rem;
    margin-top: 0px;
}
.tile-icon {
    margin-left: 30px;
    font-size: 1rem;
}
.links-list li {
    list-style-type: none;
}
.link {
    display: inline-block;
    margin-left: -30px;
    color: var(--text-color) !important;
    text-decoration: none;
}
.link:hover {
    color: rgb(255, 112, 67) !important;
    text-decoration: none;
}
.link:before {
    content: '→';
    font-weight: bold;
    margin-right: 5px;
}
.button-container {
    text-align: right;
}
.view-all-button {
    display: inline-block;
    background-color: none;
    color: var(--text-color) !important;
    text-decoration: none;
    border-radius: 5px;
}
.view-all-button:hover {
    color: rgb(255, 112, 67) !important;
}
</style>
{% endraw %}
