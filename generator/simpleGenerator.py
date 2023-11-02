import paho.mqtt.client as mqtt
import time
import random
import configuration
import threading

# Callback when connected to the broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"Client {userdata} connected to broker")
    else:
        print(f"Client {userdata} connection failed")

# Callback when a message is published
def on_publish(client, userdata, mid):
    print(f"Client {userdata} published a message")

def sender(client_name):
    client = mqtt.Client(f"{client_name}")
    client.user_data_set(client_name)  # Set the user data to the client name for easy identification in callbacks
    client.on_connect = on_connect
    client.connect(configuration.BROKER_HOST, configuration.BROKER_PORT, 60)
    client.loop_start()

    try:
        while True:
            for sensor in configuration.SENSORS:
                value_of_topic = str(round(random.uniform(0, 50), 2))
                client.publish(f"{client_name}/{sensor}", value_of_topic, qos=1)
                print(f"Topic: {client_name}/{sensor}, value: {value_of_topic}")
                time.sleep(1)
            time.sleep(5)  # Send temperature every 5 seconds

    except KeyboardInterrupt:
        print("Disconnected, exiting...")
        client.disconnect()
        client.loop_stop()



# Main code
if __name__ == "__main__":
    for room in configuration.ROOMS:
        client_thread = threading.Thread(target=sender, args=(f"client_{room}",))
        client_thread.start()

