# csc453project-analyticsserver
The analytics server for Group 6's IntelliAlarm project.

## Prerequisites
Node.js v6.10.0 (or greater)

## Installing
In the command line while in the project root folder, type:

```
npm install
```

This will install all the dependencies for the project.

## Running
Use the following command while in the project root folder to start the program:

```
npm start
```

## Deployment
The project is configured to be deployed to IBM Bluemix. The manifest.yml will need to be modified to be deployed to your server's information. Once the manifest.yml is configured, the app can be deployed using IBM's Cloud Foundry deployment application.

The API keys and MQTT server address can be found in the .env file in the root directory.
