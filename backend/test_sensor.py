# Test ultrasonic sensor
from drivers import UltrasonicSensor
import time

print("Testing HC-SR04 sensor...")
print("Wave your hand in front of the sensor\n")

sensor = UltrasonicSensor()

for i in range(20):
    dist = sensor.get_distance()
    if dist > 0:
        bar = "█" * int(dist / 5)
        print(f"Distance: {dist:6.1f} cm {bar}")
    else:
        print("Distance: [TIMEOUT]")
    time.sleep(0.3)

print("\n✅ Test complete!")
