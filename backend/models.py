"""
CityVision AI — Pydantic Data Models
"""
from pydantic import BaseModel
from typing import Optional, List


class Camera(BaseModel):
    camera_id: str
    name: str
    location: str
    latitude: float
    longitude: float
    status: str
    fps: int
    vehicle_count: int = 0
    congestion_level: str = "low"


class Vehicle(BaseModel):
    vehicle_id: str
    license_plate: str
    vehicle_type: str
    color: str
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None
    confidence: float
    cameras_visited: int = 0


class Detection(BaseModel):
    detection_id: str
    vehicle_id: str
    camera_id: str
    timestamp: str
    plate: str
    plate_confidence: float
    vehicle_confidence: float


class Trajectory(BaseModel):
    trajectory_id: str
    vehicle_id: str
    camera_sequence: List[str]
    timestamps: List[str]
    distance: float
    duration: int


class TrafficStat(BaseModel):
    camera_id: str
    timestamp: str
    vehicle_count: int
    average_speed: float
    congestion_level: str


class Alert(BaseModel):
    alert_id: str
    severity: str
    title: str
    description: str
    camera_id: Optional[str] = None
    vehicle_id: Optional[str] = None
    timestamp: str
    status: str = "active"


class SimulationEvent(BaseModel):
    event_type: str
    payload: dict
    timestamp: str


class SimulationStatus(BaseModel):
    is_running: bool
    step: int
    started_at: Optional[str] = None
