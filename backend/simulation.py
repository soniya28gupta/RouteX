"""
CityVision AI — AI Simulation Engine
Generates realistic ANPR / vehicle detection events for demo mode.
Drives the demo vehicle MP04AB1234 across 4 cameras.
"""
import asyncio
import json
import random
from datetime import datetime
from typing import Set
import aiosqlite
from database import DB_PATH

# Connected WebSocket clients
connected_clients: Set = set()

# Simulation state
_sim_task = None
_is_running = False
_step = 0

# Demo journey for the showcase vehicle
DEMO_STEPS = [
    {
        "camera_id": "CAM-001",
        "camera_name": "MP Nagar Junction",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 98.1,
        "vehicle_confidence": 97.6,
        "event_type": "vehicle_detected",
        "delay": 2,
    },
    {
        "camera_id": "CAM-001",
        "camera_name": "MP Nagar Junction",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 98.1,
        "vehicle_confidence": 97.6,
        "event_type": "plate_recognized",
        "delay": 2,
    },
    {
        "camera_id": "CAM-002",
        "camera_name": "Board Office Square",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 96.4,
        "vehicle_confidence": 95.9,
        "event_type": "vehicle_detected",
        "delay": 4,
    },
    {
        "camera_id": "CAM-002",
        "camera_name": "Board Office Square",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 96.4,
        "vehicle_confidence": 95.9,
        "event_type": "cross_camera_match",
        "match_confidence": 96.4,
        "delay": 2,
    },
    {
        "camera_id": "CAM-003",
        "camera_name": "Habibganj Junction",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 94.7,
        "vehicle_confidence": 96.3,
        "event_type": "vehicle_detected",
        "delay": 4,
    },
    {
        "camera_id": "CAM-003",
        "camera_name": "Habibganj Junction",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 94.7,
        "vehicle_confidence": 96.3,
        "event_type": "cross_camera_match",
        "match_confidence": 95.1,
        "delay": 2,
    },
    {
        "camera_id": "CAM-005",
        "camera_name": "Airport Road",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 97.2,
        "vehicle_confidence": 98.1,
        "event_type": "vehicle_detected",
        "delay": 4,
    },
    {
        "camera_id": "CAM-005",
        "camera_name": "Airport Road",
        "plate": "MP04AB1234",
        "vehicle_id": "V-1042",
        "plate_confidence": 97.2,
        "vehicle_confidence": 98.1,
        "event_type": "trajectory_updated",
        "cameras_visited": ["CAM-001", "CAM-002", "CAM-003", "CAM-005"],
        "delay": 2,
    },
    {
        "event_type": "alert_triggered",
        "alert": {
            "alert_id": "ALT-SIM-001",
            "severity": "warning",
            "title": "Congestion Alert — Board Office Road",
            "description": "Traffic density 42% above normal. Average speed dropped to 8 km/h.",
            "camera_id": "CAM-002",
        },
        "delay": 3,
    },
]

# Additional random vehicle events that fire in background
BACKGROUND_PLATES = [
    "MP04GH3311", "MP40PQ9900", "MP04RS2244", "MP20LM6677",
    "MP04TU4488", "MP09CD5566", "MP04VW1122", "DL01AB5678",
]
BACKGROUND_CAMERAS = ["CAM-001", "CAM-002", "CAM-003", "CAM-004", "CAM-005", "CAM-006"]


async def broadcast(message: dict):
    """Send JSON message to all connected WebSocket clients."""
    if not connected_clients:
        return
    data = json.dumps(message)
    dead = set()
    for ws in connected_clients:
        try:
            await ws.send_text(data)
        except Exception:
            dead.add(ws)
    connected_clients.difference_update(dead)


async def _background_noise():
    """Generate random vehicle detections in the background during simulation."""
    while _is_running:
        cam = random.choice(BACKGROUND_CAMERAS)
        plate = random.choice(BACKGROUND_PLATES)
        vid = f"V-{random.randint(1000, 9999)}"
        await broadcast({
            "event_type": "background_detection",
            "camera_id": cam,
            "vehicle_id": vid,
            "plate": plate,
            "plate_confidence": round(random.uniform(85, 99), 1),
            "vehicle_confidence": round(random.uniform(88, 99), 1),
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        })
        await asyncio.sleep(random.uniform(1.5, 4.0))


async def _run_simulation():
    global _is_running, _step
    _is_running = True
    _step = 0

    # Start background noise
    noise_task = asyncio.create_task(_background_noise())

    try:
        await broadcast({"event_type": "simulation_started", "timestamp": datetime.now().strftime("%H:%M:%S")})

        for step_data in DEMO_STEPS:
            if not _is_running:
                break
            delay = step_data.get("delay", 2)
            await asyncio.sleep(delay)

            payload = {k: v for k, v in step_data.items() if k != "delay"}
            payload["timestamp"] = datetime.now().strftime("%H:%M:%S")
            await broadcast(payload)
            _step += 1

        # Final summary event
        await asyncio.sleep(2)
        await broadcast({
            "event_type": "simulation_complete",
            "vehicle_id": "V-1042",
            "plate": "MP04AB1234",
            "cameras": ["CAM-001", "CAM-002", "CAM-003", "CAM-005"],
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        })
    finally:
        _is_running = False
        noise_task.cancel()


def start_simulation():
    global _sim_task, _is_running
    if _is_running:
        return False
    _sim_task = asyncio.create_task(_run_simulation())
    return True


def stop_simulation():
    global _is_running, _sim_task
    _is_running = False
    if _sim_task:
        _sim_task.cancel()
    return True


def get_status():
    return {
        "is_running": _is_running,
        "step": _step,
        "total_steps": len(DEMO_STEPS),
    }
