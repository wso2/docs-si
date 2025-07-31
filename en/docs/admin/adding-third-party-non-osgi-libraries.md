# Adding Third Party Non OSGi Libraries

The WSO2 Integrator: SI is OSGi-based. Therefore, when you integrate third party products such as Oracle with the WSO2 Integrator: SI, you need to check whether the libraries you need to add to the WSO2 Integrator: SI are OSGi-based. If they are not, you need to convert them to OSGi bundles before adding them to the `<SI_HOME>/lib` directory.

To convert jar files to OSGi bundles, follow the procedure given below:

1. Download the non-OSGi jar for the required third party product, and save it in a preferred directory in your machine.

2. In your CLI, navigate to the `<SI_HOME>/bin` directory. Then issue the following command.
    `./jartobundle.sh <PATH_TO_NON-OSGi_JAR> ../lib`
      
    This generates the converted file in the `<SI_HOME>/lib` directory.

3. Restart the SI server.
