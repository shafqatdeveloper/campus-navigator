# Quick test for motor driver
from drivers import MotorDriver
import time

print("Testing motor driver...")
motor = MotorDriver()

print("1. Forward 2 seconds")
motor.move_forward(50)
time.sleep(2)
motor.stop()
time.sleep(1)

print("2. Backward 2 seconds")
motor.move_backward(50)
time.sleep(2)
motor.stop()
time.sleep(1)

print("3. Turn left")
motor.turn_left(40)
time.sleep(1.5)
motor.stop()
time.sleep(1)

print("4. Turn right")
motor.turn_right(40)
time.sleep(1.5)
motor.stop()

motor.cleanup()
print("✅ Test complete!")
