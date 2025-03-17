# Installing Streaming Integrator as a Linux Service

WSO2 Streaming Integrator can be run as a Linux service. Before you begin follow the instructions on [installing the WSO2 Streaming Integrator]({{base_path}}/setup/installing-si-in-vm/) if you have not done already.

## Running WSO2 Streaming Integrator as a Linux Service

To run WSO2 Streaming Integrator as a Linux service, follow the steps below:

1. To run the product as a service, create a startup script and add it to the boot sequence. The basic structure of the startup script has three parts (i.e., start, stop and restart) as follows:

    ```bash
    #!/bin/bash
      
    case “$1″ in
    start)
       echo “Starting Service”
    ;;
    stop)
       echo “Stopping Service”
    ;;
    restart)
       echo “Restarting Service”
    ;;
    *)
       echo $”Usage: $0 {start|stop|restart}”
    exit 1
    esac
    ```

   You can write the start up scripts for the Streaming Integrator server and Tooling as follows:

   - Streaming Integrator Server

    ```bash
    #! /bin/sh
    export JAVA_HOME="<Java-Home>"
     
    startcmd='<SI-Home>/bin/server.sh start > /dev/null &'
    restartcmd='<SI-Home>/bin/server.sh restart > /dev/null &'
    stopcmd='<SI-Home>/bin/server.sh stop > /dev/null &'
     
    case "$1" in
    start)
       echo "Starting WSO2 Streaming Integrator ..."
       su -c "${startcmd}" user1
    ;;
    restart)
       echo "Re-starting WSO2 Streaming Integrator ..."
       su -c "${restartcmd}" user1
    ;;
    stop)
       echo "Stopping WSO2 Streaming Integrator ..."
       su -c "${stopcmd}" user1
    ;;
    *)
       echo "Usage: $0 {start|stop|restart}"
    exit 1
    esac
    ```

    - Streaming Integrator Tooling

    ```bash
    #! /bin/sh
    export JAVA_HOME="<Java-Home>"
     
    startcmd='<SI-Tooling-Home>/bin/tooling.sh start > /dev/null &'
    restartcmd='<SI-Tooling-Home>/bin/tooling.sh restart > /dev/null &'
    stopcmd='<SI-Tooling-Home>/bin/tooling.sh stop > /dev/null &'
     
    case "$1" in
    start)
       echo "WSO2 Streaming Integrator Tooling ..."
       su -c "${startcmd}" user1
    ;;
    restart)
       echo "Re-starting WSO2 Streaming Integrator Tooling ..."
       su -c "${restartcmd}" user1
    ;;
    stop)
       echo "Stopping WSO2 Streaming Integrator Tooling ..."
       su -c "${stopcmd}" user1
    ;;
    *)
       echo "Usage: $0 {start|stop|restart}"
    exit 1
    esac
    ```

   In the above script, the server is started via a user named `user1` rather than the root user. For example, `su -c "${startcmd}" user1`.

2. Add the script to the ` /etc/init.d/` directory.

    !!! info
        If you want to keep the scripts in a location other than `/etc/init.d/` directory , you can add a symbolic link to the script in the `/etc/init.d/` and keep the actual script in a separate location. e.g., If your script name is `siserver` and it is in the `/opt/WSO2/` directory, then the commands for adding a link to `/etc/init.d/` are as follows:<br/><br/>
        - To make the script executable: `sudo chmod a+x /opt/WSO2/appserver`<br/>
        - To add a link to `/etc/init.d/`: `sudo ln -snf /opt/WSO2/appserver /etc/init.d/appserver`

3. Install the startup script to respective run levels via the `update-rc.d` command. e.g., Issue the following command for the sample script given in step 1.

    `sudo update-rc.d appserver defaults`

    The `defaults` option in the above command makes the service start in runlevels 2,3,4, and 5, and stop in runlevels 0,1, and 6.

    !!! info
        A **runlevel**  is a mode of operation in Linux (or any Unix-style operating system). There are several runlevels in a Linux server and each of these runlevels is represented by a single digit integer. Each runlevel designates a different system configuration and allows access to a different combination of processes.

You can now start, stop and restart the server via the `service <service name> {start|stop|restart}` command. You will be prompted for the password of the username (or root) via which you started the service. 