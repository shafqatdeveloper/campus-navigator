"""
Topological Map for University A Block
Graph structure where:
- Nodes = Physical locations (rooms, corridors, landmarks)
- Edges = Navigation actions (forward, turn)
"""

class CampusMap:
    def __init__(self):
        # Define the graph structure
        # Format: {node: {neighbor: {"distance": meters, "action": "forward/turn_left/turn_right", "angle": degrees}}}
        self.graph = {
            # Ground Floor
            "Entrance": {
                "Corridor_Main": {"distance": 5.0, "action": "forward", "angle": 0}
            },
            "Corridor_Main": {
                "Entrance": {"distance": 5.0, "action": "forward", "angle": 180},
                "Stairs": {"distance": 3.0, "action": "forward", "angle": 0},
                "Faculty_Offices": {"distance": 4.0, "action": "turn_left", "angle": 90},
                "Accounts_Office": {"distance": 4.0, "action": "turn_right", "angle": -90},
            },
            "Faculty_Offices": {
                "Corridor_Main": {"distance": 4.0, "action": "turn_right", "angle": -90},
                "Director_Office": {"distance": 6.0, "action": "forward", "angle": 0}
            },
            "Director_Office": {
                "Faculty_Offices": {"distance": 6.0, "action": "forward", "angle": 180}
            },
            "Accounts_Office": {
                "Corridor_Main": {"distance": 4.0, "action": "turn_left", "angle": 90},
                "Exam_Branch": {"distance": 5.0, "action": "forward", "angle": 0}
            },
            "Exam_Branch": {
                "Accounts_Office": {"distance": 5.0, "action": "forward", "angle": 180}
            },
            "Stairs": {
                "Corridor_Main": {"distance": 3.0, "action": "forward", "angle": 180},
                "Library_Entrance": {"distance": 2.0, "action": "turn_right", "angle": -90},
                "Floor_1_Corridor": {"distance": 0.0, "action": "stairs_up", "angle": 0}  # Virtual edge
            },
            "Library_Entrance": {
                "Stairs": {"distance": 2.0, "action": "turn_left", "angle": 90},
                "Digital_Library": {"distance": 8.0, "action": "forward", "angle": 0}
            },
            "Digital_Library": {
                "Library_Entrance": {"distance": 8.0, "action": "forward", "angle": 180}
            },
            
            # First Floor (simplified)
            "Floor_1_Corridor": {
                "Stairs": {"distance": 0.0, "action": "stairs_down", "angle": 0},
                "CS_Lab": {"distance": 10.0, "action": "turn_left", "angle": 90},
                "D4": {"distance": 7.0, "action": "turn_right", "angle": -90}
            },
            "CS_Lab": {
                "Floor_1_Corridor": {"distance": 10.0, "action": "turn_right", "angle": -90}
            },
            "D4": {
                "Floor_1_Corridor": {"distance": 7.0, "action": "turn_left", "angle": 90},
                "C2_5_Classroom": {"distance": 5.0, "action": "forward", "angle": 0}
            },
            "C2_5_Classroom": {
                "D4": {"distance": 5.0, "action": "forward", "angle": 180}
            }
        }
        
        # Aliases for user-friendly names
        self.aliases = {
            "block a": "Entrance",
            "entrance": "Entrance",
            "main corridor": "Corridor_Main",
            "faculty": "Faculty_Offices",
            "director": "Director_Office",
            "accounts": "Accounts_Office",
            "exam": "Exam_Branch",
            "library": "Library_Entrance",
            "digital library": "Digital_Library",
            "cs lab": "CS_Lab",
            "d4": "D4",
            "c2.5": "C2_5_Classroom",
            "c2.5 classroom": "C2_5_Classroom"
        }
    
    def get_neighbors(self, node):
        """Get all neighbors of a node"""
        return self.graph.get(node, {})
    
    def get_all_nodes(self):
        """Get list of all nodes"""
        return list(self.graph.keys())
    
    def resolve_location(self, user_input):
        """Convert user input to canonical node name"""
        user_input = user_input.strip().lower()
        
        # Check aliases
        if user_input in self.aliases:
            return self.aliases[user_input]
        
        # Check exact match (case insensitive)
        for node in self.graph.keys():
            if node.lower() == user_input or node.replace("_", " ").lower() == user_input:
                return node
        
        return None  # Not found
    
    def get_edge_weight(self, from_node, to_node):
        """Get distance between two connected nodes"""
        neighbors = self.graph.get(from_node, {})
        edge = neighbors.get(to_node)
        if edge:
            return edge["distance"]
        return float('inf')  # No direct connection
