from fastapi import APIRouter
import aiosqlite
import random
from database import DB_PATH

router = APIRouter()

HOURLY_BASE = [
    {"hour": "06:00", "vehicles": 142, "speed": 48.2},
    {"hour": "07:00", "vehicles": 284, "speed": 38.1},
    {"hour": "08:00", "vehicles": 521, "speed": 19.4},
    {"hour": "09:00", "vehicles": 583, "speed": 14.8},
    {"hour": "10:00", "vehicles": 412, "speed": 26.3},
    {"hour": "11:00", "vehicles": 318, "speed": 31.7},
    {"hour": "12:00", "vehicles": 376, "speed": 28.9},
    {"hour": "13:00", "vehicles": 342, "speed": 30.1},
    {"hour": "14:00", "vehicles": 298, "speed": 33.4},
    {"hour": "15:00", "vehicles": 334, "speed": 31.2},
    {"hour": "16:00", "vehicles": 398, "speed": 27.6},
    {"hour": "17:00", "vehicles": 548, "speed": 16.2},
    {"hour": "18:00", "vehicles": 612, "speed": 11.8},
    {"hour": "19:00", "vehicles": 489, "speed": 21.3},
    {"hour": "20:00", "vehicles": 287, "speed": 35.8},
    {"hour": "21:00", "vehicles": 198, "speed": 42.1},
    {"hour": "22:00", "vehicles": 134, "speed": 49.3},
    {"hour": "23:00", "vehicles": 87, "speed": 54.6},
]

VEHICLE_TYPES = [
    {"type": "Cars", "count": 6840, "percentage": 54.8},
    {"type": "Bikes", "count": 3120, "percentage": 25.0},
    {"type": "Buses", "count": 748, "percentage": 6.0},
    {"type": "Trucks", "count": 623, "percentage": 5.0},
    {"type": "Auto", "count": 1155, "percentage": 9.2},
]

CONGESTION_DATA = [
    {"road": "MP Nagar Junction", "camera": "CAM-001", "level": "medium", "score": 58},
    {"road": "Board Office Road", "camera": "CAM-002", "level": "high", "score": 84},
    {"road": "Habibganj Junction", "camera": "CAM-003", "level": "medium", "score": 62},
    {"road": "Lalghati", "camera": "CAM-004", "level": "low", "score": 28},
    {"road": "Airport Road", "camera": "CAM-005", "level": "low", "score": 22},
    {"road": "BHEL Square", "camera": "CAM-006", "level": "high", "score": 78},
    {"road": "New Market", "camera": "CAM-007", "level": "medium", "score": 55},
    {"road": "Roshanpura Chowk", "camera": "CAM-008", "level": "high", "score": 81},
]

FLOW_DATA = [
    {"from": "CAM-001", "from_name": "MP Nagar", "to": "CAM-002", "to_name": "Board Office", "count": 1284},
    {"from": "CAM-002", "from_name": "Board Office", "to": "CAM-003", "to_name": "Habibganj", "count": 942},
    {"from": "CAM-003", "from_name": "Habibganj", "to": "CAM-005", "to_name": "Airport Road", "count": 687},
    {"from": "CAM-001", "from_name": "MP Nagar", "to": "CAM-007", "to_name": "New Market", "count": 812},
    {"from": "CAM-004", "from_name": "Lalghati", "to": "CAM-005", "to_name": "Airport Road", "count": 534},
    {"from": "CAM-002", "from_name": "Board Office", "to": "CAM-006", "to_name": "BHEL Square", "count": 421},
]

JOURNEY_TIMES = [
    {"from": "CAM-001", "to": "CAM-002", "avg_minutes": 6.5, "distance_km": 3.2},
    {"from": "CAM-002", "to": "CAM-003", "avg_minutes": 7.6, "distance_km": 2.8},
    {"from": "CAM-003", "to": "CAM-005", "avg_minutes": 9.1, "distance_km": 5.4},
    {"from": "CAM-001", "to": "CAM-007", "avg_minutes": 4.2, "distance_km": 1.9},
]

@router.get("/analytics/traffic-volume")
async def traffic_volume(period: str = "today"):
    # Add slight random variation to feel live
    data = []
    for h in HOURLY_BASE:
        data.append({
            **h,
            "vehicles": h["vehicles"] + random.randint(-20, 20),
            "speed": round(h["speed"] + random.uniform(-2, 2), 1),
        })
    return {"data": data, "peak_morning": "08:00–10:00", "peak_evening": "17:00–19:00"}

@router.get("/analytics/vehicle-types")
async def vehicle_types():
    return {"data": VEHICLE_TYPES}

@router.get("/analytics/congestion")
async def congestion():
    data = []
    for item in CONGESTION_DATA:
        data.append({
            **item,
            "score": item["score"] + random.randint(-5, 5),
        })
    return {"data": data, "congested_count": sum(1 for d in data if d["level"] == "high")}

@router.get("/analytics/flow")
async def vehicle_flow():
    return {"data": FLOW_DATA}

@router.get("/analytics/journey-times")
async def journey_times():
    return {"data": JOURNEY_TIMES}

@router.get("/analytics/summary")
async def summary():
    return {
        "total_vehicles": 12486,
        "unique_vehicles": 8932,
        "anpr_accuracy": 96.8,
        "active_cameras": 24,
        "total_cameras": 24,
        "average_speed": 34.2,
        "congested_roads": 7,
        "alerts_today": 6,
    }
