# Robot Control Backend for Campus Navigator

This backend provides an API for controlling a Raspberry Pi 4B robot with:

- **Hardware**: DC motors with IBT-2 drivers, HC-SR04 ultrasonic sensor
- **Navigation**: Topological graph with Dijkstra pathfinding (time-based dead reckoning)
- **API**: Flask server on port 5000

## Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

## API Endpoints

**POST /robot/navigate**

```json
{
  "destination": "D4"
}
```

Response:

```json
{
  "status": "ok",
  "path": ["Entrance", "Corridor_1", "D4"],
  "message": "Navigation started"
}
```

## Architecture

- `app.py` - Flask API server
- `navigation/` - Pathfinding and map
- `drivers/` - Hardware control (motors, sensors)
- `config.py` - GPIO pins and constants
