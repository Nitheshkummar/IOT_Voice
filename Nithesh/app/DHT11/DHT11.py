import Adafruit_DHT
import time
import json
import os

DHT_SENSOR = Adafruit_DHT.DHT11
DHT_PIN = 4
DATA_FILE = os.path.join(os.path.dirname(__file__), "dht_data.json")

while True:
    humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
    if humidity is not None and temperature is not None:
        data = {
            "temperature": round(temperature, 1),
            "humidity": round(humidity, 1)
        }
    else:
        data = {"error": "Sensor failure"}

    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

    time.sleep(2)
