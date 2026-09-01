# 🚦 RouteX

## AI-Powered Multi-Camera Vehicle Intelligence & Urban Traffic Analytics

RouteX is an AI-powered urban traffic intelligence platform that converts data from multiple CCTV cameras into connected vehicle information, movement trajectories, and actionable traffic analytics.

The platform is designed to overcome the limitation of treating every CCTV camera as an independent system. RouteX connects vehicle observations across multiple cameras using **ANPR, OCR, vehicle detection, multi-object tracking, and vehicle re-identification** to reconstruct vehicle movement across a city.

The system provides a centralized dashboard for monitoring cameras, vehicles, trajectories, traffic conditions, alerts, and system health.

---

## 🎯 Problem Statement

Modern cities operate large networks of CCTV cameras for traffic monitoring and public safety. However, individual camera feeds usually work independently.

This creates several challenges:

- A vehicle detected by one camera may not be connected with its appearance at another camera.
- Complete vehicle journeys are difficult to reconstruct.
- Traffic authorities have limited city-wide visibility of vehicle movement.
- Manual monitoring becomes difficult as the number of cameras increases.
- Traffic congestion and abnormal movement patterns may not be detected quickly.
- Large volumes of video data are difficult to process manually.

RouteX addresses these challenges by creating a unified AI-based vehicle intelligence layer over multiple camera feeds.

---

# 💡 Solution

RouteX creates a connected pipeline that transforms raw camera observations into vehicle intelligence.

The system follows this process:

**CCTV Cameras → Vehicle Detection → ANPR/OCR → Vehicle Tracking → Vehicle Re-Identification → Cross-Camera Matching → Trajectory Reconstruction → Traffic Analytics → Alerts & Dashboard**

Instead of analyzing cameras independently, RouteX attempts to answer:

> **"Where was this vehicle detected, where did it move next, and what traffic information can be derived from its movement?"**

---

# 🚗 Core Features

## 1. Multi-Camera Monitoring

RouteX provides a centralized interface for monitoring multiple CCTV camera locations.

The system can display:

- Camera status
- Camera location
- Vehicle detections
- Traffic activity
- Camera-to-camera vehicle movement

---

## 2. Vehicle Detection

The computer vision pipeline is designed to detect vehicles from camera footage.

Supported vehicle intelligence includes:

- Cars
- Buses
- Trucks
- Motorcycles
- Other road vehicles

The prototype currently demonstrates the detection workflow using simulated AI events.

---

## 3. ANPR / OCR

Automatic Number Plate Recognition is used to identify vehicle license plates.

The pipeline is designed to:

1. Detect a vehicle.
2. Locate its license plate.
3. Extract plate information using OCR.
4. Assign a confidence score.
5. Associate the plate with the vehicle observation.

Example:

`MP04AB1234 → 98.1% Plate Confidence`

---

## 4. Multi-Object Tracking

Vehicle tracking maintains the identity of a detected vehicle across consecutive video frames.

Tracking helps determine:

- Vehicle movement
- Entry and exit points
- Travel time
- Vehicle position
- Direction of movement

The architecture is designed to support **ByteTrack** for multi-object tracking.

---

## 5. Vehicle Re-Identification

Vehicle Re-ID is one of the key components of RouteX.

A vehicle may disappear from one camera and appear later in another camera.

RouteX uses vehicle appearance and contextual information to associate observations belonging to the same vehicle.

Potential features include:

- Vehicle appearance
- Vehicle type
- Color
- License plate
- Detection time
- Camera location
- Movement sequence

The architecture is designed to support **OSNet-based vehicle re-identification**.

---

## 6. Cross-Camera Vehicle Matching

RouteX connects observations from different cameras.

For example:

**CAM-001**

↓  

**CAM-002**

↓  

**CAM-003**

↓  

**CAM-005**

This allows the system to reconstruct a connected vehicle journey instead of treating each detection as an isolated event.

---

## 7. Vehicle Trajectory Reconstruction

After matching vehicle observations across cameras, RouteX reconstructs the vehicle's movement trajectory.

A trajectory can contain:

- Vehicle ID
- License plate
- Camera sequence
- Detection timestamps
- Location
- Travel duration
- Distance travelled
- Matching confidence

Example:

**MP04AB1234**

CAM-001 → CAM-002 → CAM-003 → CAM-005

---

## 8. Interactive Trajectory Explorer

The platform provides a map-based visualization of vehicle movement.

The trajectory explorer can display:

- Camera locations
- Vehicle route
- Camera sequence
- Vehicle movement
- Detection points
- Journey timeline

The prototype uses **React-Leaflet and OpenStreetMap** for map visualization.

---

## 9. Urban Traffic Analytics

RouteX converts vehicle observations into traffic-level insights.

The analytics module can provide information such as:

- Traffic volume
- Vehicle count
- Traffic flow
- Average speed
- Congestion level
- Traffic hotspots
- Camera-wise activity
- Vehicle movement patterns

This information can support better traffic management decisions.

---

## 10. Traffic Alerts

RouteX provides an alert layer for important traffic events.

Possible alerts include:

- High congestion
- Unusual vehicle movement
- Traffic buildup
- Camera connectivity issues
- Suspicious movement patterns
- Abnormal traffic activity

Alerts can be displayed directly on the centralized dashboard.

---

## 11. Camera Network Visualization

The Camera Network module provides a visual representation of connected cameras.

It helps understand:

- Camera locations
- Camera connectivity
- Vehicle transitions
- Camera-to-camera movement
- Network coverage

---

## 12. System Health Monitoring

RouteX includes a system health interface for monitoring the overall AI pipeline.

It can represent:

- Camera status
- AI processing status
- Backend status
- Database status
- Data flow
- System architecture
- Privacy controls

---

# 🧠 AI Pipeline

The RouteX AI pipeline can be represented as:

**Camera Feed**

↓

**Vehicle Detection**

↓

**License Plate Detection**

↓

**OCR / ANPR**

↓

**Multi-Object Tracking**

↓

**Vehicle Feature Extraction**

↓

**Vehicle Re-Identification**

↓

**Cross-Camera Matching**

↓

**Trajectory Reconstruction**

↓

**Traffic Analytics**

↓

**Alerts & Dashboard**

---

# 🏗️ System Architecture

RouteX follows a modular frontend-backend architecture.

```text
                    ┌─────────────────────┐
                    │    CCTV Cameras     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Vehicle Detection   │
                    │       YOLO          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     ANPR / OCR      │
                    │    PaddleOCR        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Vehicle Tracking    │
                    │     ByteTrack       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Vehicle Re-ID       │
                    │       OSNet         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Cross-Camera Match  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Trajectory Engine   │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │       Traffic Analytics        │
              │ Volume • Flow • Congestion     │
              └───────────────┬────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Dashboard & Alerts  │
                    └─────────────────────┘
