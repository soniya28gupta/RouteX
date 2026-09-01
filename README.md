# 🚦 RouteX

## AI-Powered Multi-Camera Vehicle Intelligence & Urban Traffic Analytics

RouteX is an intelligent traffic monitoring and analytics platform designed to transform data from multiple CCTV cameras into meaningful vehicle intelligence and urban traffic insights.

The platform combines **Vehicle Detection, Automatic Number Plate Recognition (ANPR), Optical Character Recognition (OCR), Multi-Object Tracking, Vehicle Re-Identification (Re-ID), Trajectory Reconstruction, Traffic Analytics, and Alert Detection** into a unified system.

Instead of viewing every CCTV camera independently, RouteX connects vehicle observations across multiple cameras to understand how vehicles move through different locations.

---

## 📌 Project Description

Modern cities have a large number of CCTV cameras installed at roads, junctions, highways, and important public locations. These cameras continuously generate valuable traffic information, but analyzing each camera separately makes it difficult to understand complete vehicle movement.

For example, a vehicle detected at one camera may later appear at another camera several kilometers away. Traditional camera-based monitoring may treat these as separate events.

RouteX addresses this problem by connecting these observations through AI-based vehicle intelligence.

The system can:

- Detect vehicles from camera feeds.
- Recognize vehicle license plates.
- Assign tracking identities to vehicles.
- Match vehicles across different cameras.
- Reconstruct vehicle journeys.
- Visualize trajectories on maps.
- Analyze traffic flow and congestion.
- Generate alerts for unusual traffic conditions.
- Present all information through a centralized dashboard.

---

# 🎯 Objectives

The main objectives of RouteX are:

1. **Automate vehicle detection** from CCTV footage.
2. **Recognize license plates** using ANPR and OCR.
3. **Track vehicles** across multiple video frames.
4. **Re-identify vehicles** across different camera locations.
5. **Reconstruct vehicle trajectories** from camera observations.
6. **Analyze urban traffic patterns** using collected vehicle data.
7. **Detect congestion and abnormal movement patterns.**
8. **Provide a centralized traffic intelligence dashboard.**

---

# 💡 Core Concept

The basic concept of RouteX is:

```text
CCTV Cameras
      ↓
Vehicle Detection
      ↓
ANPR / OCR
      ↓
Vehicle Tracking
      ↓
Vehicle Re-Identification
      ↓
Cross-Camera Matching
      ↓
Trajectory Reconstruction
      ↓
Traffic Analytics
      ↓
Dashboard & Alerts

📁 Project Structure
RouteX/
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── pages/
│   │   │   ├── Overview/
│   │   │   ├── LiveCameras/
│   │   │   ├── VehicleTracking/
│   │   │   ├── TrajectoryExplorer/
│   │   │   ├── TrafficAnalytics/
│   │   │   ├── Alerts/
│   │   │   ├── CameraNetwork/
│   │   │   └── SystemHealth/
│   │   │
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── CameraPanel/
│   │   │   ├── Toast/
│   │   │   └── Common/
│   │   │
│   │   ├── data/
│   │   │   └── seedData.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── simulation.ts
│   │   │
│   │   ├── store/
│   │   │   └── simulationStore.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   │
│   ├── routers/
│   │   ├── cameras.py
│   │   ├── vehicles.py
│   │   ├── detections.py
│   │   ├── analytics.py
│   │   └── alerts.py
│   │
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── simulation.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
🛠️ Technology Stack
Frontend
React
TypeScript
Tailwind CSS
Vite
Zustand
Recharts
React-Leaflet
OpenStreetMap
Backend
Python
FastAPI
WebSocket
Database
SQLite
AI / Computer Vision
Python
OpenCV
YOLOv8
PyTorch
PaddleOCR
ByteTrack
OSNet

✨ Key Features
🚗 Multi-Camera Vehicle Detection

Detect and monitor vehicles across multiple camera locations.

🔢 ANPR / OCR

Recognize license plates and associate them with vehicle detections.

🎯 Vehicle Tracking

Track vehicles across consecutive video frames.

🧠 Vehicle Re-Identification

Match the same vehicle across different camera views using visual and contextual features.

🛣️ Trajectory Reconstruction

Combine camera detections to reconstruct a vehicle's journey.

🗺️ Interactive Trajectory Map

Visualize vehicle movement and camera transitions geographically.

📊 Traffic Analytics

Analyze:

Traffic volume
Vehicle categories
Traffic flow
Average speed
Congestion
Traffic hotspots
🚨 Alerts

Identify and display important traffic and system events.

📹 Camera Network

Monitor camera locations, connectivity and vehicle transitions.

🖥️ Unified Dashboard

Provides a centralized interface for monitoring vehicles, cameras, trajectories and traffic conditions.

🚀 Installation
Prerequisites
Node.js
npm
Python 3.10+
Git
Frontend
cd frontend
npm install
npm run dev

Open:

http://localhost:5173
Backend
cd backend
python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start FastAPI:

uvicorn main:app --reload --port 8000
🔐 Privacy & Responsible AI

RouteX is designed with privacy-aware principles:

Role-based access
Audit logging
Controlled vehicle queries
Configurable data retention
Secure communication
Encryption
Metadata-focused storage
On-premise processing capability

Real-world deployment should undergo appropriate privacy, legal and security review.

📈 Future Scope
Real-time RTSP camera integration
GPU-based inference
Improved ANPR accuracy
Advanced vehicle Re-ID
PostgreSQL/PostGIS integration
Edge AI deployment
Predictive congestion analysis
Accident detection
Emergency vehicle detection
Smart traffic signal integration
City-scale distributed processing
🌆 Applications

RouteX can support:

Smart traffic management
Urban mobility analysis
Traffic congestion monitoring
Vehicle journey analysis
Traffic hotspot identification
Infrastructure planning
Intelligent transportation systems
Real-time traffic monitoring
📌 Project Status

RouteX currently provides a functional prototype featuring:

Multi-camera monitoring
Vehicle detection interface
ANPR demonstration
Vehicle tracking
Cross-camera matching
Trajectory visualization
Traffic analytics
Alert management
Camera network visualization
System health monitoring
Simulation-based demonstration
FastAPI backend
🚦 RouteX

From Camera Feeds to Connected Vehicle Intelligence.

Detect → Identify → Track → Reconstruct → Analyze
