HEAD
# CityVision AI

**Multi-Camera ANPR · Vehicle Intelligence · Urban Traffic Analytics**

> SIH26127 — City-Wide AI Engine for Multi-Camera ANPR Trajectory Tracking and Urban Traffic Analytics

---

## 🚀 Quick Start (Frontend Only — Recommended for Demo)

The frontend is **fully self-contained** with embedded seed data and a built-in simulation engine. No backend required for the demo.

```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## 🧠 Demo Flow (30-second showcase)

1. **Open Overview Dashboard** — see KPI cards: 12,486 vehicles, 96.8% ANPR accuracy, 24 cameras
2. **Click "▶ Start AI Simulation"** (top-right button)
3. **Watch** — toast notifications fire as MP04AB1234 is detected at CAM-001 → CAM-002 → CAM-003 → CAM-005
4. **Go to Live Cameras** — see bounding boxes animate on camera feeds
5. **Go to Vehicle Tracking** — search `MP04AB1234` → see full journey timeline
6. **Go to Trajectory Explorer** — see the animated route on the Bhopal city map
7. **Go to Traffic Analytics** — charts auto-populated with traffic volume, congestion, flow
8. **Go to Alerts** — see 6 real alerts including suspicious vehicle movement and congestion
9. **Go to Camera Network** — Re-ID process visual + camera topology diagram
10. **Go to System Health** — AI pipeline + architecture diagram + privacy controls

---

## 📁 Project Structure

```
RouteX/
├── frontend/              React + TypeScript + Tailwind + Vite
│   ├── src/
│   │   ├── pages/         9 application pages
│   │   ├── components/    Layout, Toast, Camera panels
│   │   ├── data/          seedData.ts — 24 cameras, 8 vehicles, demo journey
│   │   ├── services/      api.ts (with fallback), simulation.ts (frontend engine)
│   │   ├── store/         simulationStore.ts (Zustand)
│   │   └── types/         index.ts — TypeScript interfaces
│   └── package.json
│
└── backend/               Python FastAPI (optional)
    ├── main.py            FastAPI app + WebSocket
    ├── database.py        SQLite init + seed data
    ├── simulation.py      AI simulation engine
    ├── models.py          Pydantic models
    ├── routers/           cameras, vehicles, detections, analytics, alerts
    └── requirements.txt
```

---

## 🛠 Full Stack Setup (with Python Backend)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then in `frontend/src/services/api.ts`, set:
```ts
const USE_SEED = false;
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend proxy in `vite.config.ts` will route `/api` → `http://localhost:8000`.

---

## 🔌 Connecting Real AI Models

The architecture is designed for plug-and-play AI integration:

| Interface Point | Replace with |
|---|---|
| `backend/simulation.py` | Real YOLO detections from RTSP streams |
| `DEMO_STEPS` events | YOLOv8 + ByteTrack bounding boxes |
| Plate confidence values | PaddleOCR / EasyOCR output |
| Cross-camera match events | OSNet Re-ID feature similarity |
| Camera feeds (Canvas) | HLS/RTSP stream via `<video>` element |

---

## 📷 Demo Cameras (Bhopal, MP)

| ID | Location | Lat | Lon |
|---|---|---|---|
| CAM-001 | MP Nagar Junction | 23.2337 | 77.4325 |
| CAM-002 | Board Office Square | 23.2441 | 77.4073 |
| CAM-003 | Habibganj Junction | 23.2298 | 77.4341 |
| CAM-004 | Lalghati | 23.2600 | 77.3700 |
| CAM-005 | Airport Road | 23.2876 | 77.3370 |
| CAM-006 | BHEL Square | 23.2700 | 77.4100 |
| ... | 24 total | | |

---

## 🗺 Demo Vehicle Journey

```
MP04AB1234 (White Sedan · V-1042)

10:02:14 → CAM-001 (MP Nagar Junction)       — Plate: 98.1%
10:08:42 → CAM-002 (Board Office Square)     — Plate: 96.4% · Match: 96.4%
10:16:18 → CAM-003 (Habibganj Junction)      — Plate: 94.7% · Match: 95.1%
10:24:51 → CAM-005 (Airport Road)            — Plate: 97.2%

Journey: 22m 37s · 12.4 km
```

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Map | React-Leaflet + OpenStreetMap |
| State | Zustand |
| Backend | Python FastAPI |
| Database | SQLite (aiosqlite) |
| Real-time | WebSocket (FastAPI) |
| Vehicle Detection | YOLOv8 (simulated) |
| Multi-Object Tracking | ByteTrack (simulated) |
| ANPR/OCR | PaddleOCR (simulated) |
| Re-Identification | OSNet (simulated) |

---

## 🔒 Privacy & Responsible AI

- Role-based access control (architecture level)
- Audit logging for all vehicle queries
- Configurable data retention (30-day default)
- AES-256 encryption at rest, TLS 1.3 in transit
- Only license plates and vehicle metadata stored — no driver identity
- On-premise AI inference — no raw video sent externally
- **Note:** This prototype demonstrates intended controls. Legal compliance requires certified security audit.

---

## 🏆 SIH26127 — Smart India Hackathon 2026

**Problem Statement:** City-Wide AI Engine for Multi-Camera ANPR Trajectory Tracking and Urban Traffic Analytics

**Key Features Demonstrated:**
- ✅ Multi-camera vehicle tracking
- ✅ ANPR with confidence scores
- ✅ Cross-camera vehicle re-identification
- ✅ Trajectory reconstruction on interactive map
- ✅ Urban traffic analytics (volume, speed, congestion, flow)
- ✅ Alert & anomaly detection
- ✅ AI pipeline visualization
- ✅ System architecture view
- ✅ Privacy & responsible AI framework
- ✅ Real-time simulation demo mode
  
# RouteX

