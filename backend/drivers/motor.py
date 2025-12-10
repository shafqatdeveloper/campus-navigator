"""
Motor Driver for IBT-2 H-Bridge
Controls DC motors with forward/reverse capability
"""
try:
    import RPi.GPIO as GPIO
    GPIO_AVAILABLE = True
except (ImportError, RuntimeError):
    GPIO_AVAILABLE = False
    print("⚠️  RPi.GPIO not available - Running in SIMULATION mode")

import time
from config import LEFT_RPWM, LEFT_LPWM, RIGHT_RPWM, RIGHT_LPWM

class MotorDriver:
    def __init__(self):
        self.simulated = not GPIO_AVAILABLE
        
        if not self.simulated:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            
            # Setup all motor pins as outputs
            GPIO.setup([LEFT_RPWM, LEFT_LPWM, RIGHT_RPWM, RIGHT_LPWM], GPIO.OUT)
            
            # Create PWM objects (1000 Hz frequency)
            self.left_r_pwm = GPIO.PWM(LEFT_RPWM, 1000)
            self.left_l_pwm = GPIO.PWM(LEFT_LPWM, 1000)
            self.right_r_pwm = GPIO.PWM(RIGHT_RPWM, 1000)
            self.right_l_pwm = GPIO.PWM(RIGHT_LPWM, 1000)
            
            # Start all PWM at 0% duty cycle
            self.left_r_pwm.start(0)
            self.left_l_pwm.start(0)
            self.right_r_pwm.start(0)
            self.right_l_pwm.start(0)
        
        print(f"🤖 Motor Driver initialized ({'SIMULATED' if self.simulated else 'HARDWARE'})")
    
    def set_motors(self, left_speed, right_speed):
        """
        Set motor speeds
        :param left_speed: -100 to 100 (negative = reverse)
        :param right_speed: -100 to 100 (negative = reverse)
        """
        if self.simulated:
            print(f"   🔧 Motors: L={left_speed:+4d}% R={right_speed:+4d}%")
            return
        
        # Left Motor
        if left_speed >= 0:
            self.left_r_pwm.ChangeDutyCycle(abs(left_speed))
            self.left_l_pwm.ChangeDutyCycle(0)
        else:
            self.left_r_pwm.ChangeDutyCycle(0)
            self.left_l_pwm.ChangeDutyCycle(abs(left_speed))
        
        # Right Motor
        if right_speed >= 0:
            self.right_r_pwm.ChangeDutyCycle(abs(right_speed))
            self.right_l_pwm.ChangeDutyCycle(0)
        else:
            self.right_r_pwm.ChangeDutyCycle(0)
            self.right_l_pwm.ChangeDutyCycle(abs(right_speed))
    
    def move_forward(self, speed=50):
        """Move both motors forward"""
        self.set_motors(speed, speed)
    
    def move_backward(self, speed=50):
        """Move both motors backward"""
        self.set_motors(-speed, -speed)
    
    def turn_left(self, speed=40):
        """Turn left (left motor backward, right forward)"""
        self.set_motors(-speed, speed)
    
    def turn_right(self, speed=40):
        """Turn right (left motor forward, right backward)"""
        self.set_motors(speed, -speed)
    
    def stop(self):
        """Stop all motors"""
        self.set_motors(0, 0)
    
    def cleanup(self):
        """Cleanup GPIO"""
        self.stop()
        if not self.simulated:
            self.left_r_pwm.stop()
            self.left_l_pwm.stop()
            self.right_r_pwm.stop()
            self.right_l_pwm.stop()
            GPIO.cleanup()
        print("🛑 Motor Driver cleaned up")
