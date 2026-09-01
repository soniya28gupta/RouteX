from fastapi import APIRouter
import aiosqlite
from database import DB_PATH

router = APIRouter()

@router.get("/detections")
async def get_detections(limit: int = 50, camera_id: str = None, plate: str = None):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        query = """
            SELECT d.*, c.name as camera_name, c.location, v.vehicle_type, v.color
            FROM detections d
            LEFT JOIN cameras c ON d.camera_id = c.camera_id
            LEFT JOIN vehicles v ON d.vehicle_id = v.vehicle_id
            WHERE 1=1
        """
        params = []
        if camera_id:
            query += " AND d.camera_id = ?"
            params.append(camera_id)
        if plate:
            query += " AND d.plate LIKE ?"
            params.append(f"%{plate.upper()}%")
        query += f" ORDER BY d.timestamp DESC LIMIT {limit}"
        async with db.execute(query, params) as cursor:
            rows = await cursor.fetchall()
    return [dict(r) for r in rows]
