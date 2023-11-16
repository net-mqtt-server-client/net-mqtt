# Configuration
BROKER_HOST = "localhost"
BROKER_PORT = 1883
NUMBER_OF_CLIENTS = 1
MESSAGE_DELAY = 2
ROOMS = {"livingroom", "bedroom", "hall", "toilet"}
SENSOR_READ_DELAY = 2  # Delay between sensor readings in seconds
SENSORS = {
    "temperature": (15, 25),
    "humidity": (10, 100),
    "light": (1, 1000),
    "sound": (1, 1000)
}


