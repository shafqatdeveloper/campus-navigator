"""
Navigation Executor
Converts path instructions into robot movement commands
"""
import time
from drivers import MotorDriver, UltrasonicSensor
from config import DEFAULT_SPEED, TURN_SPEED, TIME_PER_METER, TIME_PER_90_TURN, OBSTACLE_THRESHOLD_CM

class Navigator:
    def __init__(self):
        self.motor = MotorDriver()
        self.sensor = UltrasonicSensor()
        self.is_navigating = False
        
    def execute_instructions(self, instructions):
        """
        Execute a list of navigation instructions
        
        :param instructions: List of instruction dicts from pathfinding
        :return: Success status
        """
        self.is_navigating = True
        
        print(f"\n🚀 Starting navigation with {len(instructions)} steps\n")
        
        try:
            for i, instr in enumerate(instructions):
                if not self.is_navigating:
                    print("⏸️  Navigation cancelled")
                    break
                
                print(f"Step {i+1}/{len(instructions)}: {instr['from']} → {instr['to']}")
                print(f"   Action: {instr['action']}, Distance: {instr['distance']}m")
                
                # Execute action
                if instr["action"] == "forward":
                    self._move_forward(instr["distance"])
                elif instr["action"] == "turn_left":
                    self._turn(-90)
                    if instr["distance"] > 0:
                        self._move_forward(instr["distance"])
                elif instr["action"] == "turn_right":
                    self._turn(90)
                    if instr["distance"] > 0:
                        self._move_forward(instr["distance"])
                elif instr["action"] == "stairs_up":
                    print("   ⚠️  STAIRS - Manual intervention required")
                    self.motor.stop()
                    return False  # Can't climb stairs
                elif instr["action"] == "stairs_down":
                    print("   ⚠️  STAIRS - Manual intervention required")
                    self.motor.stop()
                    return False
                
                time.sleep(0.5)  # Brief pause between actions
            
            self.motor.stop()
            print("\n✅ Navigation complete!")
            return True
            
        except Exception as e:
            print(f"❌ Navigation error: {e}")
            self.motor.stop()
            return False
        finally:
            self.is_navigating = False
    
    def _move_forward(self, distance_meters):
        """Move forward for calculated time based on distance"""
        duration = distance_meters * TIME_PER_METER
        
        print(f"   ▶️  Moving forward {distance_meters}m (≈{duration:.1f}s)")
        
        self.motor.move_forward(DEFAULT_SPEED)
        
        # Monitor for obstacles while moving
        start_time = time.time()
        while time.time() - start_time < duration:
            if self.sensor.is_obstacle_ahead(OBSTACLE_THRESHOLD_CM):
                print("   ⚠️  OBSTACLE DETECTED - Stopping")
                self.motor.stop()
                time.sleep(2)  # Wait for obstacle to clear
                
                # Check again
                if self.sensor.is_obstacle_ahead(OBSTACLE_THRESHOLD_CM):
                    print("   ❌ Path blocked - Cannot continue")
                    return False
                else:
                    print("   ✅ Path clear - Resuming")
                    self.motor.move_forward(DEFAULT_SPEED)
                    start_time = time.time()  # Reset timer
            
            time.sleep(0.1)  # Check every 100ms
        
        self.motor.stop()
        return True
    
    def _turn(self, angle_degrees):
        """
        Turn the robot
        :param angle_degrees: Positive = right, Negative = left
        """
        turns_90 = abs(angle_degrees) / 90.0
        duration = turns_90 * TIME_PER_90_TURN
        
        direction = "RIGHT" if angle_degrees > 0 else "LEFT"
        print(f"   🔄 Turning {direction} {abs(angle_degrees)}° (≈{duration:.1f}s)")
        
        if angle_degrees > 0:
            self.motor.turn_right(TURN_SPEED)
        else:
            self.motor.turn_left(TURN_SPEED)
        
        time.sleep(duration)
        self.motor.stop()
        time.sleep(0.3)  # Settle
    
    def stop_navigation(self):
        """Emergency stop"""
        self.is_navigating = False
        self.motor.stop()
        print("🛑 Navigation stopped")
    
    def cleanup(self):
        """Cleanup resources"""
        self.motor.cleanup()
