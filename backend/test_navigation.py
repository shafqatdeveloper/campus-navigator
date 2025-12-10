"""
Test script for the navigation system
Run this to verify components work correctly
"""
from navigation import CampusMap, dijkstra, get_navigation_instructions

def test_pathfinding():
    print("=" * 60)
    print("Testing Navigation System")
    print("=" * 60)
    
    campus_map = CampusMap()
    
    # Test 1: List all locations
    print("\n📍 Available Locations:")
    for node in campus_map.get_all_nodes():
        print(f"   - {node}")
    
    # Test 2: Resolve location names
    print("\n🔍 Testing Location Resolution:")
    test_inputs = ["D4", "d4", "cs lab", "entrance", "faculty"]
    for inp in test_inputs:
        resolved = campus_map.resolve_location(inp)
        print(f"   '{inp}' → {resolved}")
    
    # Test 3: Find paths
    print("\n🗺️  Testing Pathfinding:")
    test_routes = [
        ("Entrance", "D4"),
        ("Entrance", "CS_Lab"),
        ("Entrance", "Digital_Library"),
        ("Faculty_Offices", "D4")
    ]
    
    for start, goal in test_routes:
        path, distance = dijkstra(campus_map, start, goal)
        if path:
            print(f"\n   {start} → {goal}")
            print(f"   Distance: {distance:.1f}m")
            print(f"   Path: {' → '.join(path)}")
            
            # Get instructions
            instructions = get_navigation_instructions(campus_map, path)
            print(f"   Instructions ({len(instructions)} steps):")
            for i, instr in enumerate(instructions):
                print(f"      {i+1}. {instr['action']} ({instr['distance']}m) to {instr['to']}")
        else:
            print(f"\n   {start} → {goal}: NO PATH FOUND")
    
    print("\n" + "=" * 60)
    print("✅ Tests Complete")
    print("=" * 60)

if __name__ == "__main__":
    test_pathfinding()
