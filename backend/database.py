"""
CityVision AI — Database Layer
SQLite with aiosqlite, seed data for demo mode.
"""
import asyncio
import aiosqlite
import json
from datetime import datetime, timedelta
import random
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "cityvision.db")

CAMERAS = [
    {"camera_id": "CAM-001", "name": "MP Nagar Junction", "location": "MP Nagar, Bhopal", "latitude": 23.2337, "longitude": 77.4325, "status": "active", "fps": 25},
    {"camera_id": "CAM-002", "name": "Board Office Square", "location": "Board Office, Bhopal", "latitude": 23.2441, "longitude": 77.4073, "status": "active", "fps": 25},
    {"camera_id": "CAM-003", "name": "Habibganj Junction", "location": "Habibganj, Bhopal", "latitude": 23.2298, "longitude": 77.4341, "status": "active", "fps": 30},
    {"camera_id": "CAM-004", "name": "Lalghati", "location": "Lalghati, Bhopal", "latitude": 23.2600, "longitude": 77.3700, "status": "active", "fps": 25},
    {"camera_id": "CAM-005", "name": "Airport Road", "location": "Raja Bhoj Airport, Bhopal", "latitude": 23.2876, "longitude": 77.3370, "status": "active", "fps": 30},
    {"camera_id": "CAM-006", "name": "BHEL Square", "location": "BHEL, Bhopal", "latitude": 23.2700, "longitude": 77.4100, "status": "active", "fps": 25},
    {"camera_id": "CAM-007", "name": "New Market", "location": "New Market, Bhopal", "latitude": 23.2350, "longitude": 77.3950, "status": "active", "fps": 25},
    {"camera_id": "CAM-008", "name": "Roshanpura", "location": "Roshanpura Chowk, Bhopal", "latitude": 23.2400, "longitude": 77.4200, "status": "active", "fps": 20},
    {"camera_id": "CAM-009", "name": "Berasia Road", "location": "Berasia Road, Bhopal", "latitude": 23.3000, "longitude": 77.4300, "status": "active", "fps": 25},
    {"camera_id": "CAM-010", "name": "Kolar Road", "location": "Kolar, Bhopal", "latitude": 23.1750, "longitude": 77.4500, "status": "active", "fps": 25},
    {"camera_id": "CAM-011", "name": "Arera Colony", "location": "Arera Colony, Bhopal", "latitude": 23.2050, "longitude": 77.4350, "status": "active", "fps": 30},
    {"camera_id": "CAM-012", "name": "Hoshangabad Road", "location": "Hoshangabad Road, Bhopal", "latitude": 23.1900, "longitude": 77.4100, "status": "active", "fps": 25},
    {"camera_id": "CAM-013", "name": "10 No. Market", "location": "10 No. Market, Bhopal", "latitude": 23.2550, "longitude": 77.4050, "status": "active", "fps": 25},
    {"camera_id": "CAM-014", "name": "Chetak Bridge", "location": "Chetak Bridge, Bhopal", "latitude": 23.2475, "longitude": 77.4175, "status": "active", "fps": 25},
    {"camera_id": "CAM-015", "name": "Jahangirabad", "location": "Jahangirabad, Bhopal", "latitude": 23.2650, "longitude": 77.4250, "status": "active", "fps": 20},
    {"camera_id": "CAM-016", "name": "Karond", "location": "Karond Square, Bhopal", "latitude": 23.3100, "longitude": 77.4000, "status": "active", "fps": 25},
    {"camera_id": "CAM-017", "name": "Idgah Hills", "location": "Idgah Hills, Bhopal", "latitude": 23.2620, "longitude": 77.3950, "status": "degraded", "fps": 12},
    {"camera_id": "CAM-018", "name": "Shyamla Hills", "location": "Shyamla Hills, Bhopal", "latitude": 23.2450, "longitude": 77.3850, "status": "active", "fps": 25},
    {"camera_id": "CAM-019", "name": "Sehore Road", "location": "Sehore Road, Bhopal", "latitude": 23.2200, "longitude": 77.3700, "status": "active", "fps": 25},
    {"camera_id": "CAM-020", "name": "Bhanpur", "location": "Bhanpur, Bhopal", "latitude": 23.1650, "longitude": 77.4700, "status": "active", "fps": 25},
    {"camera_id": "CAM-021", "name": "Misrod", "location": "Misrod, Bhopal", "latitude": 23.1500, "longitude": 77.4600, "status": "active", "fps": 25},
    {"camera_id": "CAM-022", "name": "Bairagarh", "location": "Bairagarh, Bhopal", "latitude": 23.3200, "longitude": 77.3600, "status": "active", "fps": 25},
    {"camera_id": "CAM-023", "name": "Pipalner", "location": "Pipalner Square, Bhopal", "latitude": 23.2800, "longitude": 77.4400, "status": "active", "fps": 25},
    {"camera_id": "CAM-024", "name": "Vidhan Sabha", "location": "Vidhan Sabha Road, Bhopal", "latitude": 23.2560, "longitude": 77.4010, "status": "active", "fps": 30},
]

VEHICLES = [
    {"vehicle_id": "V-1042", "license_plate": "MP04AB1234", "vehicle_type": "Sedan", "color": "White", "confidence": 97.2},
    {"vehicle_id": "V-0891", "license_plate": "MP04XY7788", "vehicle_type": "SUV", "color": "Black", "confidence": 95.1},
    {"vehicle_id": "V-0234", "license_plate": "MP09CD5566", "vehicle_type": "Hatchback", "color": "Silver", "confidence": 93.8},
    {"vehicle_id": "V-0567", "license_plate": "MP04GH3311", "vehicle_type": "Bus", "color": "Red", "confidence": 98.3},
    {"vehicle_id": "V-0678", "license_plate": "MP40PQ9900", "vehicle_type": "Truck", "color": "Blue", "confidence": 91.5},
    {"vehicle_id": "V-0789", "license_plate": "MP04RS2244", "vehicle_type": "Bike", "color": "Black", "confidence": 89.6},
    {"vehicle_id": "V-0345", "license_plate": "MP20LM6677", "vehicle_type": "Sedan", "color": "Grey", "confidence": 96.2},
    {"vehicle_id": "V-0456", "license_plate": "MP04TU4488", "vehicle_type": "SUV", "color": "White", "confidence": 94.7},
]

# Demo vehicle journey
DEMO_JOURNEY = [
    {"camera_id": "CAM-001", "timestamp": "10:02:14", "plate_confidence": 98.1, "vehicle_confidence": 97.6},
    {"camera_id": "CAM-002", "timestamp": "10:08:42", "plate_confidence": 96.4, "vehicle_confidence": 95.9},
    {"camera_id": "CAM-003", "timestamp": "10:16:18", "plate_confidence": 94.7, "vehicle_confidence": 96.3},
    {"camera_id": "CAM-005", "timestamp": "10:24:51", "plate_confidence": 97.2, "vehicle_confidence": 98.1},
]


async def get_db():
    return await aiosqlite.connect(DB_PATH)


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript("""
            CREATE TABLE IF NOT EXISTS cameras (
                camera_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                status TEXT DEFAULT 'active',
                fps INTEGER DEFAULT 25,
                vehicle_count INTEGER DEFAULT 0,
                congestion_level TEXT DEFAULT 'low'
            );

            CREATE TABLE IF NOT EXISTS vehicles (
                vehicle_id TEXT PRIMARY KEY,
                license_plate TEXT UNIQUE NOT NULL,
                vehicle_type TEXT,
                color TEXT,
                first_seen TEXT,
                last_seen TEXT,
                confidence REAL,
                cameras_visited INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS detections (
                detection_id TEXT PRIMARY KEY,
                vehicle_id TEXT,
                camera_id TEXT,
                timestamp TEXT,
                plate TEXT,
                plate_confidence REAL,
                vehicle_confidence REAL,
                FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
                FOREIGN KEY (camera_id) REFERENCES cameras(camera_id)
            );

            CREATE TABLE IF NOT EXISTS trajectories (
                trajectory_id TEXT PRIMARY KEY,
                vehicle_id TEXT,
                camera_sequence TEXT,
                timestamps TEXT,
                distance REAL,
                duration INTEGER,
                FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
            );

            CREATE TABLE IF NOT EXISTS traffic_stats (
                stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
                camera_id TEXT,
                timestamp TEXT,
                vehicle_count INTEGER,
                average_speed REAL,
                congestion_level TEXT
            );

            CREATE TABLE IF NOT EXISTS alerts (
                alert_id TEXT PRIMARY KEY,
                severity TEXT,
                title TEXT,
                description TEXT,
                camera_id TEXT,
                vehicle_id TEXT,
                timestamp TEXT,
                status TEXT DEFAULT 'active'
            );

            CREATE TABLE IF NOT EXISTS simulation_state (
                id INTEGER PRIMARY KEY,
                is_running INTEGER DEFAULT 0,
                step INTEGER DEFAULT 0,
                started_at TEXT
            );

            INSERT OR IGNORE INTO simulation_state (id, is_running, step) VALUES (1, 0, 0);
        """)
        await db.commit()

        # Seed cameras
        for cam in CAMERAS:
            await db.execute(
                "INSERT OR IGNORE INTO cameras (camera_id, name, location, latitude, longitude, status, fps) VALUES (?,?,?,?,?,?,?)",
                (cam["camera_id"], cam["name"], cam["location"], cam["latitude"], cam["longitude"], cam["status"], cam["fps"])
            )

        # Seed vehicles
        base_time = datetime.now().replace(hour=10, minute=0, second=0, microsecond=0)
        for v in VEHICLES:
            first_seen = (base_time + timedelta(minutes=random.randint(0, 30))).strftime("%H:%M:%S")
            last_seen = (base_time + timedelta(minutes=random.randint(31, 90))).strftime("%H:%M:%S")
            await db.execute(
                "INSERT OR IGNORE INTO vehicles (vehicle_id, license_plate, vehicle_type, color, first_seen, last_seen, confidence, cameras_visited) VALUES (?,?,?,?,?,?,?,?)",
                (v["vehicle_id"], v["license_plate"], v["vehicle_type"], v["color"], first_seen, last_seen, v["confidence"], random.randint(2, 6))
            )

        # Seed demo journey detections
        import uuid
        for i, step in enumerate(DEMO_JOURNEY):
            det_id = f"DET-DEMO-{i+1:03d}"
            await db.execute(
                "INSERT OR IGNORE INTO detections (detection_id, vehicle_id, camera_id, timestamp, plate, plate_confidence, vehicle_confidence) VALUES (?,?,?,?,?,?,?)",
                (det_id, "V-1042", step["camera_id"], step["timestamp"], "MP04AB1234", step["plate_confidence"], step["vehicle_confidence"])
            )

        # Seed demo trajectory
        await db.execute(
            "INSERT OR IGNORE INTO trajectories (trajectory_id, vehicle_id, camera_sequence, timestamps, distance, duration) VALUES (?,?,?,?,?,?)",
            ("TRJ-DEMO-001", "V-1042",
             json.dumps(["CAM-001", "CAM-002", "CAM-003", "CAM-005"]),
             json.dumps(["10:02:14", "10:08:42", "10:16:18", "10:24:51"]),
             12.4, 1357)
        )

        # Seed traffic stats (hourly data for charts)
        hours = list(range(6, 24))
        cam_ids = [c["camera_id"] for c in CAMERAS[:6]]
        for hour in hours:
            for cam_id in cam_ids:
                count = random.randint(80, 350)
                speed = random.uniform(18, 55)
                if 8 <= hour <= 10 or 17 <= hour <= 19:
                    count = random.randint(300, 600)
                    speed = random.uniform(10, 25)
                cong = "high" if count > 400 else ("medium" if count > 250 else "low")
                ts = f"{hour:02d}:00"
                await db.execute(
                    "INSERT INTO traffic_stats (camera_id, timestamp, vehicle_count, average_speed, congestion_level) VALUES (?,?,?,?,?)",
                    (cam_id, ts, count, round(speed, 1), cong)
                )

        # Seed alerts
        alerts = [
            ("ALT-001", "critical", "Suspicious Vehicle Movement", "MP04XY7788 detected at CAM-002 and CAM-006 within an unusually short 4-minute interval — possible speed violation.", "CAM-006", "V-0891", "10:14:22"),
            ("ALT-002", "warning", "Congestion Alert — Board Office Road", "Traffic density 42% above normal threshold. Average speed dropped to 8 km/h.", "CAM-002", None, "10:31:05"),
            ("ALT-003", "warning", "Low ANPR Confidence Detected", "Plate recognition confidence dropped to 61% on CAM-004. Possible obstruction or weather interference.", "CAM-004", None, "10:22:17"),
            ("ALT-004", "info", "Camera Health Degraded", "CAM-017 FPS dropped to 12 (threshold: 20). Maintenance recommended.", "CAM-017", None, "09:48:33"),
            ("ALT-005", "warning", "Blacklisted Plate Detected", "Plate MP09XX9999 matched against watchlist at CAM-009. Flagged for review.", "CAM-009", None, "10:45:11"),
            ("ALT-006", "info", "Unusual Route Detected", "V-0567 (MP04GH3311) deviated from expected route. Last 3 detections inconsistent with normal pattern.", "CAM-013", "V-0567", "11:02:38"),
        ]
        for a in alerts:
            await db.execute(
                "INSERT OR IGNORE INTO alerts (alert_id, severity, title, description, camera_id, vehicle_id, timestamp) VALUES (?,?,?,?,?,?,?)",
                a
            )

        await db.commit()
    print(f"[DB] Database initialized at {DB_PATH}")
