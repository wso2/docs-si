# Configuring Extension Dependencies

This page is for extension developers building custom Siddhi extensions and wiring them into the **Extension Installer** panel. For instructions on installing and uninstalling existing Siddhi extensions, see [Downloading and Installing Siddhi Extensions](../connectors/downloading-and-Installing-Siddhi-Extensions.md).

Configurations of Siddhi extensions are loaded from the `<SI_HOME>/wso2/server/resources/extensionsInstaller/extensionDependencies.json` configuration file.

When you are working with [custom extensions](../connectors/writing-Custom-Siddhi-Extensions.md), and if you want a custom extension to be installable from the **Extension Installer** panel, you need to add the configuration of the extension to this configuration file.

The configuration of an extension is a JSON object that looks as follows:

```json
    "<extension_name>": {
      "extension": {...},
      "dependencies": [
        {...},
        {...}
      ]
    }
```

`<extension_name>` which is the key of this JSON object, is the uniquely identifiable name of the extension. The extension is described under [`extension`](#extension).

#### `extension`

This _object_ contains information about the extension, denoted by the following properties.

<table>
  <tr>
    <th>Property</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <code>name</code>
    </td>
    <td>
      The uniquely identifiable name of the extension.
    </td>
  </tr>
  <tr>
    <td>
      <code>displayName</code>
    </td>
    <td>
      The displayable name of the extension.
    </td>
  </tr>
  <tr>
    <td>
      <code>version</code>
    </td>
    <td>
      The version of the extension.
    </td>
  </tr>
</table>

The following is an example of the `extension` object, taken from the configuration of the `jms` extension.

```json
  "jms": {

    "extension": {
      "name": "jms",
      "displayName": "JMS",
      "version": "2.0.2"
    },

    "dependencies": [...]
  }
```


#### `dependencies`

This is an _array_. Each member of this _array_ is an _object_ that denotes information of a dependency of the extension via the following properties.

!!! info
        The jar of the Siddhi extension itself should be added as a dependency too. e.g., In the configuration of the `jms` extension, you can see that `siddhi-io-jms` has been listed as a dependency under `dependencies`.

<table>
  <tr>
    <th>
      Property
    </th>
    <th>
      Description
    </th>
  </tr>
  <tr>
    <td>
      <code>name</code>
    </td>
    <td>
      The uniquely identifiable name of the dependency. If this dependency denotes the jar of the Siddhi extension itself, it starts with <code>siddhi-</code>.
    </td>
  </tr>
  <tr>
    <td>
      <code>version</code>
    </td>
    <td>
      The version of the dependency.
    </td>
  </tr>
  <tr>
    <td><code>download</code></td>
    <td>
      <p>This denotes download information of the dependency via the following properties.</p>
      <ul>
        <li><code>autoDownloadable</code>: This specifies whether the dependency is auto downloadable via the <code>true</code> and <code>false</code> values. If the value is <code>false</code>, the property is manually installable (see <a href="../connectors/downloading-and-Installing-Siddhi-Extensions.md#manually-installable-dependencies">Manually installable dependencies</a>).</li>
        <li><code>url</code>: <strong>If the dependency is auto downloadable</strong>, this specifies the URL via which the JAR of the dependency is downloaded.</li>
        <li><code>instructions</code>: <strong>If the dependency is only manually installable</strong>, this property provides instructions to download (and if applicable, convert) the JAR of the dependency.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>usages</code>
    </td>
    <td>
      <p>This is an <i>array</i>. Each member of this <i>array</i> is an <i>object</i> that denotes a directory where the jar of the dependency needs to be placed. Each such directory (location) is denoted by the following properties:</p>
      <ul>
        <li><code>type</code>: The type of the JAR. Possible values are as follows:<br/><li style="margin-left:2em"><code>BUNDLE</code>: This means that the dependency JAR is an OSGi bundle.</li><li style="margin-left:2em"><code>JAR</code>: This means that the dependency JAR is not converted to an OSGi bundle.</li></li><br/>
        <li><code>usedBy</code>: This indicates whether the JAR is used in runtime or in samples. For more information, see the explanation of <b>installation locations</b> under <a href="../connectors/downloading-and-Installing-Siddhi-Extensions.md#manually-installable-dependencies">Manually installable dependencies</a></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>lookupRegex</code>
    </td>
    <td>
      The regex pattern for the file name of the JAR. This is useful for to looking up and detecting whether the JAR is available in the locations mentioned under <code>usages</code>.
    </td>
  </tr>
</table>

The following examples, taken from the configuration of the `jms` extension, show the members of the `dependencies` array.

**Example 1: Auto downloadable dependency**

This denotes the `hawtbuf` dependency of the `jms` extension, which is auto downloadable from the URL specified in `download.url`.

```json
  "jms": {
    "extension": {...},

    "dependencies": [

      {
        "name": "hawtbuf",
        "version": "1.9",
        "download": {
          "autoDownloadable": true,
          "url": "https://repo1.maven.org/maven2/org/fusesource/hawtbuf/hawtbuf/1.9/hawtbuf-1.9.jar"
        },
        "usages": [
          {
            "type": "BUNDLE",
            "usedBy": "RUNTIME"
          },
          {
            "type": "JAR",
            "usedBy": "SAMPLES"
          }
        ],
        "lookupRegex": "hawtbuf([_-])1.9.jar"
      },

      ...
    ]
  }
```

**Example 2: Manually installable dependency**

This denotes the `activemq-client` dependency of the `jms` extension. This dependency needs to be manually downloaded, and the conversions should be done based on the given `download.instructions`.

```json
  "jms": {
    "extension": {...},

    "dependencies": [
      ...,

      {
        "name": "activemq-client",
        "version": "5.9.0",
        "download": {
          "autoDownloadable": false,
          "instructions": "Download the jar from 'https://repo1.maven.org/maven2/org/apache/activemq/activemq-client/5.9.0/activemq-client-5.9.0.jar' and convert ..."
        },
        "usages": [
          {
            "type": "BUNDLE",
            "usedBy": "RUNTIME"
          }
        ],
        "lookupRegex": "activemq([_-])client([_-])5.9.0(.*).jar"
      }
    ]
  }
```
