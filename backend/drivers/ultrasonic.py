"""
HC-SR04 Ultrasonic Distance Sensor Driver
Measures distance using ultrasonic pulses
"""
try:
    import RPi.GPIO as GPIO
    GPIO_AVAILABLE = True
except (ImportError, RuntimeError):
    GPIO_AVAILABLE = False

import time
from config import TRIG_PIN, ECHO_PIN

class UltrasonicSensor:
    def __init__(self):
        self.simulated = not GPIO_AVAILABLE
        
        if not self.simulated:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            GPIO.setup(TRIG_PIN, GPIO.OUT)
            GPIO.setup(ECHO_PIN, GPIO.IN)
            GPIO.output(TRIG_PIN, GPIO.LOW)
            time.sleep(0.1)  # Settle
        
        print(f"📡 Ultrasonic Sensor initialized ({'SIMULATED' if self.simulated else 'HARDWARE'})")
    
    def get_distance(self):
        """
        Returns distance in centimeters
        """
        if self.simulated:
            # Return safe distance in simulation
            return 100.0
        
        # Send 10us pulse
        GPIO.output(TRIG_PIN, GPIO.HIGH)
        time.sleep(0.00001)
        GPIO.output(TRIG_PIN, GPIO.LOW)
        
        # Wait for echo
        pulse_start = time.time()
        timeout = pulse_start + 0.1  # 100ms timeout
        
        while GPIO.input(ECHO_PIN) == 0:
            pulse_start = time.time()
            if pulse_start > timeout:
                return -1  # Timeout
        
        pulse_end = time.time()
        timeout = pulse_end + 0.1
        
        while GPIO.input(ECHO_PIN) == 1:
            pulse_end = time.time()
            if pulse_end > timeout:
                return -1  # Timeout
        
        pulse_duration = pulse_end - pulse_start
        distance = pulse_duration * 17150  # Speed of sound / 2
        distance = round(distance, 2)
        
        return distance
    
    def is_obstacle_ahead(self, threshold_cm=20):
        """Check if obstacle within threshold"""
        dist = self.get_distance()
        if dist < 0:
            return False  # Timeout = assume clear
        return dist < threshold_cm
