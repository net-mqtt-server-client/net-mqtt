# net-mqtt

## Table of Contents

- [Overview](#overview)
- [Backend](#backend)
- [Frontend](#frontend)
- [Configuration](#configuration)
- [Usage](#usage)
- [Copyright and License](#copyright-and-license)


- [Backend](#backend)
  - [Project structure](#project-structure)
  - [Main used libraries](#main-used-libraries)
  - [Endpoints](#endpoints)
  - [Implemented features](#implemented-features)
  
- [Configuration](#configuration)
  - [Databases](#databases)
  - [Frontend](#frontend)
    - [Initial setup](#initial-setup)
- [Copyright and License](#copyright-and-license)

## Overview
This repository contains the codebase for `net-mqtt`, a robust MQTT messaging solution with a backend service using ASP.NET Core and a frontend application built with Angular. It allows for real-time communication with IoT devices and provides a user interface for monitoring and managing the sensor data.

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
  
  Application sends notifications to all connected applications. To connect to solution send web socker request ```wss://localhost:28234/api/notify```.  Url can be set in ```appsettings.json```.

### Implemented features
- [x] Automatic data download from queues, data conversion and saving in the database
- [x] Reading data from the database
- [x] Filtering and sorting data based on given criteria
- [x] Data export (filtered, sorted) in CSV, JSON format

## Frontend

The frontend of `net-mqtt` is an Angular-based application that provides a real-time user interface for displaying sensor data. It uses the SignalR library to enable real-time web functionality, allowing for live updates of sensor readings without the need for page refreshes.

### Project Structure

The Angular project is structured to include modules for each main feature, components for each view, and services to handle business logic and API calls.

- `/src/app`
- `/modules` - Feature modules.
- `/components` - Reusable Angular components.
- `/services` - Services for HTTP requests and SignalR connections.

### Main Used Libraries

- `@angular/core` - The core Angular framework.
- `@microsoft/signalr` - The Microsoft SignalR library for Angular, enabling real-time communication.
- `primeNG` - A collection of rich UI components for Angular.
- `rxjs` - Reactive extensions for Angular, used for managing state and data flow.

### SignalR Integration

The application uses SignalR for subscribing to backend notifications. The service logic located at `/src/app/components/sensor-data/sensor-data.component.ts` handles the connection and coordination of real-time data updates.

### Real-Time Data Updates

The application uses a subscription model to listen for data updates from the backend. Upon receiving a new message, the frontend updates the relevant components, ensuring the display is always current.

### PrimeNG Components

PrimeNG components are utilized to create a responsive and interactive user interface. Components such as charts, tables, and dropdowns are styled and configured to present sensor data effectively.

### Styling

The application uses a combination of PrimeNG's theming capabilities and custom SCSS for styling.

## Configuration

Configuration of the application is handled through environment variables and configuration files. Adjust `environment.ts` for development settings and `environment.prod.ts` for production settings.

### Databases
1. Open ```net-mqtt``` folder in terminal
2. ```docker compose up -d```

## Usage

### Frontend
#### Initial setup
1. Navigate to the  ```front``` directory.
2. Install dependencies with  ```npm install```.
3. Run the development server with  ```npm start```.
3. Open page at `http://localhost:3000/`.

#### Building for Production

1. Run `ng build --prod` to create a production build.

## Copyright and License
Copyright 2023 Yauheni Hulevich, Dzianis Dziurdz, Fiodar Litskevich, Danila Rubleuski  <br>
Code released under the MIT license.
