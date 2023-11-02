import paho.mqtt.client as mqtt
import configuration  # Assuming you have this module with your configurations


# Callback when a message is received
def on_message(client, userdata, message):
    print(f"Received message '{message.payload.decode()}' on topic '{message.topic}'")


# Callback when connected to the broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to broker")
        # Subscribe to all topics
        client.subscribe("#")
    else:
        print("Connection failed")


# Main code
if __name__ == "__main__":
    client = mqtt.Client()

    # Set callback functions
    client.on_connect = on_connect
    client.on_message = on_message

    # Connect to the broker
    client.connect(configuration.BROKER_HOST, configuration.BROKER_PORT, 60)

    # Blocking call to process network traffic, dispatches callbacks, and handle reconnecting
    client.loop_forever()