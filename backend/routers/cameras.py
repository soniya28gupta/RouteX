from fastapi import APIRouter
import aiosqlite
from database import DB_PATH, CAMERAS
import random

router = APIRouter()

@router.get("/cameras")
async def get_cameras():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM cameras") as cursor:
            rows = await cursor.fetchall()
            cams = [dict(r) for r in rows]
    # Inject live-ish stats
    for cam in cams:
        cam["vehicle_count"] = random.randint(12, 85)
        if cam["status"] == "degraded":
            cam["vehicle_count"] = random.randint(0, 10)
        cnt = cam["vehicle_count"]
        cam["congestion_level"] = "high" if cnt > 65 else ("medium" if cnt > 35 else "low")
    return cams

@router.get("/cameras/{camera_id}")
async def get_camera(camera_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM cameras WHERE camera_id=?", (camera_id,)) as cursor:
            row = await cursor.fetchone()
    if not row:
        return {"error": "Camera not found"}
    cam = dict(row)
    cam["vehicle_count"] = random.randint(12, 85)
    cam["congestion_level"] = "medium"
    return cam

@router.get("/cameras/{camera_id}/detections")
async def get_camera_detections(camera_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT d.*, v.vehicle_type, v.color FROM detections d LEFT JOIN vehicles v ON d.vehicle_id=v.vehicle_id WHERE d.camera_id=? ORDER BY d.timestamp DESC LIMIT 20",
            (camera_id,)
        ) as cursor:
            rows = await cursor.fetchall()
    return [dict(r) for r in rows]
