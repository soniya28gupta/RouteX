from fastapi import APIRouter
import aiosqlite
import json
from database import DB_PATH

router = APIRouter()

@router.get("/vehicles")
async def get_vehicles():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM vehicles ORDER BY vehicle_id") as cursor:
            rows = await cursor.fetchall()
    return [dict(r) for r in rows]

@router.get("/vehicles/search")
async def search_vehicles(q: str = ""):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        pattern = f"%{q.upper()}%"
        async with db.execute(
            "SELECT * FROM vehicles WHERE license_plate LIKE ? OR vehicle_id LIKE ? LIMIT 10",
            (pattern, pattern)
        ) as cursor:
            rows = await cursor.fetchall()
    return [dict(r) for r in rows]

@router.get("/vehicles/{identifier}")
async def get_vehicle(identifier: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        # Try by plate first, then vehicle_id
        async with db.execute(
            "SELECT * FROM vehicles WHERE license_plate=? OR vehicle_id=?",
            (identifier.upper(), identifier)
        ) as cursor:
            row = await cursor.fetchone()
    if not row:
        return {"error": "Vehicle not found"}
    return dict(row)

@router.get("/vehicles/{vehicle_id}/detections")
async def get_vehicle_detections(vehicle_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        # Look up by plate or vehicle_id
        async with db.execute(
            "SELECT vehicle_id FROM vehicles WHERE license_plate=? OR vehicle_id=?",
            (vehicle_id.upper(), vehicle_id)
        ) as cursor:
            vrow = await cursor.fetchone()
        if not vrow:
            return []
        vid = vrow["vehicle_id"]
        async with db.execute(
            """SELECT d.*, c.name as camera_name, c.location as camera_location, c.latitude, c.longitude
               FROM detections d
               LEFT JOIN cameras c ON d.camera_id = c.camera_id
               WHERE d.vehicle_id=?
               ORDER BY d.timestamp""",
            (vid,)
        ) as cursor:
            rows = await cursor.fetchall()
    return [dict(r) for r in rows]

@router.get("/vehicles/{vehicle_id}/trajectory")
async def get_vehicle_trajectory(vehicle_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT vehicle_id FROM vehicles WHERE license_plate=? OR vehicle_id=?",
            (vehicle_id.upper(), vehicle_id)
        ) as cursor:
            vrow = await cursor.fetchone()
        if not vrow:
            return {"error": "Vehicle not found"}
        vid = vrow["vehicle_id"]
        async with db.execute(
            "SELECT * FROM trajectories WHERE vehicle_id=?", (vid,)
        ) as cursor:
            row = await cursor.fetchone()
    if not row:
        return {"error": "No trajectory found"}
    t = dict(row)
    t["camera_sequence"] = json.loads(t["camera_sequence"])
    t["timestamps"] = json.loads(t["timestamps"])
    return t
