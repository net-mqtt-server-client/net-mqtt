import paho.mqtt.client as mqtt
import time
import random
import configuration
import threading
from datetime import datetime


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
    client.user_data_set(client_name)
    client.on_connect = on_connect
    client.connect(configuration.BROKER_HOST, configuration.BROKER_PORT, 60)
    client.loop_start()

    try:
        while True:
            for room in configuration.ROOMS:
                for sensor, limits in configuration.SENSORS.items():
                    min_limit, max_limit = limits
                    value_of_topic = str(round(random.uniform(min_limit, max_limit), 2))
                    current_time = datetime.now()
                    message = f"{current_time};{value_of_topic}"
                    client.publish(f"{client_name}_{room}/{sensor}", message, qos=1)
                    print(f"Topic: {client_name}_{room}/{sensor}, value: {message}")
                    time.sleep(configuration.MESSAGE_DELAY)
                time.sleep(configuration.SENSOR_READ_DELAY)

    except KeyboardInterrupt:
        print("Disconnected, exiting...")
        client.disconnect()
        client.loop_stop()


# Main code
if __name__ == "__main__":
    # for i in range(0, configuration.NUMBER_OF_CLIENTS):
    client_thread = threading.Thread(target=sender, args=(f"client",))
    client_thread.start()
