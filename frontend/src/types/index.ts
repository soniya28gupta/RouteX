// CityVision AI — TypeScript Interfaces

export interface Camera {
  camera_id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'degraded' | 'offline';
  fps: number;
  vehicle_count: number;
  congestion_level: 'low' | 'medium' | 'high';
}

export interface Vehicle {
  vehicle_id: string;
  license_plate: string;
  vehicle_type: string;
  color: string;
  first_seen: string;
  last_seen: string;
  confidence: number;
  cameras_visited: number;
}

export interface Detection {
  detection_id: string;
  vehicle_id: string;
  camera_id: string;
  camera_name?: string;
  camera_location?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  plate: string;
  plate_confidence: number;
  vehicle_confidence: number;
  vehicle_type?: string;
  color?: string;
}

export interface Trajectory {
  trajectory_id: string;
  vehicle_id: string;
  camera_sequence: string[];
  timestamps: string[];
  distance: number;
  duration: number;
}

export interface Alert {
  alert_id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  camera_id?: string;
  vehicle_id?: string;
  timestamp: string;
  status: string;
}

export interface TrafficVolume {
  hour: string;
  vehicles: number;
  speed: number;
}

export interface VehicleType {
  type: string;
  count: number;
  percentage: number;
}

export interface CongestionData {
  road: string;
  camera: string;
  level: 'low' | 'medium' | 'high';
  score: number;
}

export interface FlowData {
  from: string;
  from_name: string;
  to: string;
  to_name: string;
  count: number;
}

export interface SimEvent {
  event_type: string;
  camera_id?: string;
  camera_name?: string;
  vehicle_id?: string;
  plate?: string;
  plate_confidence?: number;
  vehicle_confidence?: number;
  match_confidence?: number;
  cameras_visited?: string[];
  alert?: Alert;
  timestamp: string;
}

export type NavPage =
  | 'overview'
  | 'cameras'
  | 'tracking'
  | 'anpr'
  | 'trajectory'
  | 'analytics'
  | 'alerts'
  | 'network'
  | 'health';
