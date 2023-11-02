# net-mqtt

## Backend
Backend part of the application was written using **ASP.NET Core** and **.Net 7.0**.

### Project structure
Solution was implemented using DDD (Domain Driven Design) pattern. Accoriding to it, solution was separated into 4 projects:

- SIN

  Application layer project, contains following elements:
  - SignalR client (**Hubs/HubClient.cs**)
  - MQTT subscriber (**Subscribers/MqttSubscriber.cs**)
  - REST controllers (**Constrollers/MeasurementController.cs**)
  - Application sturtup class (**Program.cs**, **Startup.cs**)
  - Application startup configuration (**Properties/launchSettings.json**)
  - Solution configuration (**appsettings.json**)
- SIN.Services

  Part of application layer actually, but for projects' smaller size moved to separate project. Contains following elements:

  - Measurement service (**Services/MeasurementService.cs**) along with its interface (**Services/Interfaces/IMeasurementService.cs**)
  - Converters (**Converters/CsvConverter.cs**, **Converters/JsonConverter.cs**) along with their interfaces (**Converters/Interfaces/ICsvConverter.cs**, **Converters/Interfaces/IJsonConverter.cs**)
- SIN.Infrastrucutre

  Infrastructure layer project, where business logic takes place. Contains following elements:
  - Database context (**Context/ApplicationContext.cs**) along with its interface (**Context/Interfaces/IApplicationContext.cs**)
  - Repository implementation (**Repositories/MeasurementRepository.cs**) along with its interface (**Repositories/Interfaces/IMeasurementRepository.cs**)
- SIN.Domain

  Domain layer project, containing entity Measurement (**Entities/Measurement.cs**), representing single sensor measurement value, sensor name and location name.

### Main used libraries
- StyleCop v1.1.118 - code analyzer
- MongoDB.Driver v2.22.0 - MongoDB driver for c#
- Newtonsoft v13.0.3 - JSON serializer
- MQTTnet v4.3.1.873 - MQTT subscriber
- Microsoft.AspNetCore.SignalR v7.0.13 - SignalR library

### Endpoints
- HTTP (accepts requests from localhost:3000 because of CORS, can be modified in ```appsettings.json```)
  - ```GET http://localhost:28234/api/measurements``` - get all measurements from database. Params:
    - location=\<location name\> - filter by location
    - sensor=\<sensor name\> - filter by sensor type
    - order-by=\<column name\> - sort by column
    - order=\<asc|desc\> - sorting order
    - number=\<nodesnumber\> - number of nodes to take
  - ```GET http://localhost:28234/api/measurements/json``` - get measurements from database as json file. Params:
    - location=\<location name/> - filter by location
    - sensor=<\sensor name\> - filter by sensor type
    - order-by=\<column name\> - sort by column
    - order=<\asc|desc\> - sorting order
    - number=\<nodesnumber\> - number of nodes to take
  - ```GET http://localhost:28234/api/measurements/csv``` - get measurements from database as csv file. Params:
    - location=\<location name\> - filter by location
    - sensor=\<sensor name\> - filter by sensor type
    - order-by=\<column name\> - sort by column
    - order=\<asc|desc\> - sorting order
    - number=\<nodesnumber\> - number of nodes to take
- MQTT
  
  Consumes measurements on 16 topics (combinations of 4 locations and 4 sensors) on ```localhost:1883``` as client1. Topics, host, port and client name can be modified  in ```appsettings.json```.
- SignalR
  
  Application sends notifications to all connected applications. To connect to solution send web socker request ```wss://localhost:28234/notify```.  Url can be set in ```appsettings.json```.

### Implemented features
- [x] Automatic data download from queues, data conversion and saving in the database
- [x] Reading data from the database
- [x] Filtering and sorting data based on given criteria
- [x] Data export (filtered, sorted) in CSV, JSON format
