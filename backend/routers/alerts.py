from fastapi import APIRouter
import aiosqlite
from database import DB_PATH

router = APIRouter()

@router.get("/alerts")
async def get_alerts(severity: str = None):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        if severity:
            async with db.execute(
                "SELECT * FROM alerts WHERE severity=? ORDER BY timestamp DESC", (severity,)
            ) as cursor:
                rows = await cursor.fetchall()
        else:
            async with db.execute("SELECT * FROM alerts ORDER BY timestamp DESC") as cursor:
                rows = await cursor.fetchall()
    return [dict(r) for r in rows]

@router.get("/alerts/{alert_id}")
async def get_alert(alert_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM alerts WHERE alert_id=?", (alert_id,)) as cursor:
            row = await cursor.fetchone()
    if not row:
        return {"error": "Alert not found"}
    return dict(row)
