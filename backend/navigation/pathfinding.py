"""
Dijkstra's Algorithm for shortest path finding
"""
import heapq

def dijkstra(graph_map, start, goal):
    """
    Find shortest path using Dijkstra's algorithm
    
    :param graph_map: CampusMap instance
    :param start: Start node name
    :param goal: Goal node name
    :return: (path, total_distance) or (None, None) if no path
    """
    # Priority queue: (distance, current_node, path)
    pq = [(0, start, [start])]
    visited = set()
    
    while pq:
        current_dist, current_node, path = heapq.heappop(pq)
        
        if current_node in visited:
            continue
        
        visited.add(current_node)
        
        # Goal reached
        if current_node == goal:
            return path, current_dist
        
        # Explore neighbors
        neighbors = graph_map.get_neighbors(current_node)
        for neighbor, edge_data in neighbors.items():
            if neighbor not in visited:
                new_dist = current_dist + edge_data["distance"]
                new_path = path + [neighbor]
                heapq.heappush(pq, (new_dist, neighbor, new_path))
    
    return None, None  # No path found


def get_navigation_instructions(graph_map, path):
    """
    Convert path to movement instructions
    
    :param graph_map: CampusMap instance
    :param path: List of node names
    :return: List of instruction dicts
    """
    if not path or len(path) < 2:
        return []
    
    instructions = []
    
    for i in range(len(path) - 1):
        from_node = path[i]
        to_node = path[i + 1]
        
        neighbors = graph_map.get_neighbors(from_node)
        edge = neighbors.get(to_node)
        
        if edge:
            instructions.append({
                "from": from_node,
                "to": to_node,
                "action": edge["action"],
                "distance": edge["distance"],
                "angle": edge.get("angle", 0)
            })
    
    return instructions
