"""Navigation package"""
from .campus_map import CampusMap
from .pathfinding import dijkstra, get_navigation_instructions
from .navigator import Navigator

__all__ = ['CampusMap', 'dijkstra', 'get_navigation_instructions', 'Navigator']
