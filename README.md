🚦 RouteX
AI-Powered Multi-Camera Vehicle Intelligence & Urban Traffic Analytics

RouteX is an intelligent traffic monitoring platform that transforms data from multiple CCTV cameras into connected vehicle intelligence and actionable urban traffic insights.

It combines Vehicle Detection, ANPR/OCR, Multi-Object Tracking, Vehicle Re-Identification, Cross-Camera Matching, Trajectory Reconstruction, Traffic Analytics, and Alert Detection into a unified platform.

Instead of analyzing every CCTV camera independently, RouteX connects vehicle observations across multiple locations to understand where vehicles are detected, how they move, and how traffic conditions change across the city.

🎯 Objectives

RouteX is designed to:

🚗 Detect vehicles from multiple CCTV cameras.
🔢 Extract license plates using ANPR and OCR.
🎯 Track vehicles across video frames.
🧠 Re-identify vehicles across different cameras.
🔗 Connect detections from multiple camera locations.
🗺️ Reconstruct complete vehicle trajectories.
📊 Analyze traffic volume, flow, speed and congestion.
🚨 Detect traffic anomalies and generate alerts.
📡 Provide a centralized real-time traffic intelligence dashboard.
💡 Core Concept
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
✨ Key Features
📹 Multi-Camera Monitoring

Monitor multiple CCTV camera locations through a centralized interface.

🚗 Vehicle Detection

Detect vehicles from camera feeds using computer vision models.

🔢 ANPR / OCR

Automatically detect and recognize vehicle license plates and generate confidence scores.

🎯 Vehicle Tracking

Track detected vehicles across consecutive frames using multi-object tracking.

🧠 Vehicle Re-Identification

Identify the same vehicle across different camera views using visual vehicle features.

🔗 Cross-Camera Matching

Connect vehicle detections from different cameras to create a unified vehicle journey.

🗺️ Trajectory Reconstruction

Reconstruct and display vehicle movement between camera locations.

📊 Urban Traffic Analytics

Analyze:

Traffic volume
Vehicle flow
Average speed
Congestion
Traffic hotspots
Camera-wise traffic activity
🚨 Alert & Anomaly Detection

Generate alerts for events such as:

Unusual vehicle movement
Traffic congestion
Abnormal traffic patterns
Camera-related issues
🖥️ Unified Dashboard

Provides a centralized view of:

Vehicles
Cameras
Trajectories
Traffic analytics
Alerts
System health
🏗️ System Architecture
                    ┌──────────────────┐
                    │   CCTV Cameras   │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Vehicle Detection│
                    │      YOLO        │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │    ANPR / OCR    │
                    │   Plate Reading  │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Vehicle Tracking │
                    │    ByteTrack     │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Vehicle Re-ID    │
                    │     OSNet        │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Cross-Camera     │
                    │    Matching      │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │   Trajectory     │
                    │ Reconstruction   │
                    └────────┬─────────┘
                             ↓
              ┌──────────────┴──────────────┐
              ↓                             ↓
      ┌────────────────┐            ┌────────────────┐
      │Traffic Analytics│            │ Alerts & Events │
      └───────┬────────┘            └───────┬────────┘
              └──────────────┬──────────────┘
                             ↓
                    ┌──────────────────┐
                    │   Web Dashboard  │
                    └──────────────────┘
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
AI & Computer Vision
Python
YOLOv8
OpenCV
PyTorch
PaddleOCR
ByteTrack
OSNet

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
