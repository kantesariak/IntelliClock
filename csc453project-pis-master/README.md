# csc453project-pis

Contains the three programs for the Raspberry Pis: Alarm Clock, Coffee Maker, and Photoresistor. 

## Prerequisites

Java  
Eclipse (To build the code)  

## Installing

To only run the programs, the desired .jar file just needs to be copied to a Raspberry Pi. Each of the three .jar files can be found in the same directory as this README.

To build the programs, Eclipse/Maven needs to be used to download the dependencies specified in the pom.xml. After the dependecies are downloaded, the program(s) can be built. Note, each program (alarm clock, coffee maker, photoresistor) has its own Program.java file and must be compiled separately. We used Eclipse to export a .jar file for each of the Program.java files.

## Running

### To run the alarm clock program:
```
sudo java -jar AlarmClock.jar
```

Note, the bikehorn.wav must also be in the same directory as the jar file in order to run.

### To run the photoresitor program:
```
sudo java -jar photoresistor.jar
```

### To run the coffee maker program:
```
sudo java -jar coffeemaker.jar
```

All these programs are expected to be run on a Raspberry Pi 3 B+ with GPIO enabled.

## Settings
The address of the MQTT broker is hardcoded into the MqttProgram.java file.

