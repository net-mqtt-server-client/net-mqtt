
# Mosquitto MQTT Broker Setup with Docker

This guide will walk you through the steps to launch the Mosquitto MQTT broker inside a Docker container.

## Prerequisites

- Docker installed on your machine.

## Launching Mosquitto

1. **Pull the Mosquitto Docker Image**:
   
   Download the official Mosquitto image from Docker Hub:

   ```bash
   docker pull eclipse-mosquitto
   ```

2. **Run Mosquitto in a Docker Container**:

   Launch the Mosquitto broker with default ports for MQTT (1883) and WebSockets (9001):

   ```bash
   docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto
   ```

## Configuration (if needed)

If you're having trouble connecting to the broker, you may need to adjust its configuration.

1. **Modify the Configuration**:

   Add the following lines to the Mosquitto configuration file (`/mosquitto/config/mosquitto.conf`):

   ```
   listener 1883
   allow_anonymous true
   ```

   This configuration allows connections on port 1883 and permits anonymous connections.

## Launching Utilities

1. **Launch `simpleGenerator`**:

   After setting up the Mosquitto broker, you can launch `simpleGenerator` to start publishing messages.

2. **Debugging with `simpleSubscriber`**:

   If you need to debug or monitor the messages being published, you can use the `simpleSubscriber` utility.

---

**Note**: Always be cautious when allowing anonymous connections, especially if the broker is exposed to the internet. Ensure you secure your broker for production deployments.
