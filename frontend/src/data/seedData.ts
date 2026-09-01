// CityVision AI — Seed Data (Frontend Standalone Mode)
// Used when backend is unavailable; mirrors the Python seed data exactly.

import type { Camera, Vehicle, Detection, Alert, TrafficVolume, VehicleType, CongestionData, FlowData } from '../types';

export const CAMERAS: Camera[] = [
  { camera_id: 'CAM-001', name: 'MP Nagar Junction',   location: 'MP Nagar, Bhopal',         latitude: 23.2337, longitude: 77.4325, status: 'active',   fps: 25, vehicle_count: 58, congestion_level: 'medium' },
  { camera_id: 'CAM-002', name: 'Board Office Square',  location: 'Board Office, Bhopal',      latitude: 23.2441, longitude: 77.4073, status: 'active',   fps: 25, vehicle_count: 84, congestion_level: 'high'   },
  { camera_id: 'CAM-003', name: 'Habibganj Junction',   location: 'Habibganj, Bhopal',         latitude: 23.2298, longitude: 77.4341, status: 'active',   fps: 30, vehicle_count: 62, congestion_level: 'medium' },
  { camera_id: 'CAM-004', name: 'Lalghati',             location: 'Lalghati, Bhopal',          latitude: 23.2600, longitude: 77.3700, status: 'active',   fps: 25, vehicle_count: 28, congestion_level: 'low'    },
  { camera_id: 'CAM-005', name: 'Airport Road',         location: 'Raja Bhoj Airport, Bhopal', latitude: 23.2876, longitude: 77.3370, status: 'active',   fps: 30, vehicle_count: 21, congestion_level: 'low'    },
  { camera_id: 'CAM-006', name: 'BHEL Square',          location: 'BHEL, Bhopal',              latitude: 23.2700, longitude: 77.4100, status: 'active',   fps: 25, vehicle_count: 76, congestion_level: 'high'   },
  { camera_id: 'CAM-007', name: 'New Market',           location: 'New Market, Bhopal',        latitude: 23.2350, longitude: 77.3950, status: 'active',   fps: 25, vehicle_count: 54, congestion_level: 'medium' },
  { camera_id: 'CAM-008', name: 'Roshanpura',           location: 'Roshanpura Chowk, Bhopal',  latitude: 23.2400, longitude: 77.4200, status: 'active',   fps: 20, vehicle_count: 80, congestion_level: 'high'   },
  { camera_id: 'CAM-009', name: 'Berasia Road',         location: 'Berasia Road, Bhopal',      latitude: 23.3000, longitude: 77.4300, status: 'active',   fps: 25, vehicle_count: 33, congestion_level: 'low'    },
  { camera_id: 'CAM-010', name: 'Kolar Road',           location: 'Kolar, Bhopal',             latitude: 23.1750, longitude: 77.4500, status: 'active',   fps: 25, vehicle_count: 41, congestion_level: 'medium' },
  { camera_id: 'CAM-011', name: 'Arera Colony',         location: 'Arera Colony, Bhopal',      latitude: 23.2050, longitude: 77.4350, status: 'active',   fps: 30, vehicle_count: 37, congestion_level: 'low'    },
  { camera_id: 'CAM-012', name: 'Hoshangabad Road',     location: 'Hoshangabad Road, Bhopal',  latitude: 23.1900, longitude: 77.4100, status: 'active',   fps: 25, vehicle_count: 46, congestion_level: 'medium' },
  { camera_id: 'CAM-013', name: '10 No. Market',        location: '10 No. Market, Bhopal',     latitude: 23.2550, longitude: 77.4050, status: 'active',   fps: 25, vehicle_count: 53, congestion_level: 'medium' },
  { camera_id: 'CAM-014', name: 'Chetak Bridge',        location: 'Chetak Bridge, Bhopal',     latitude: 23.2475, longitude: 77.4175, status: 'active',   fps: 25, vehicle_count: 68, congestion_level: 'high'   },
  { camera_id: 'CAM-015', name: 'Jahangirabad',         location: 'Jahangirabad, Bhopal',      latitude: 23.2650, longitude: 77.4250, status: 'active',   fps: 20, vehicle_count: 45, congestion_level: 'medium' },
  { camera_id: 'CAM-016', name: 'Karond',               location: 'Karond Square, Bhopal',     latitude: 23.3100, longitude: 77.4000, status: 'active',   fps: 25, vehicle_count: 29, congestion_level: 'low'    },
  { camera_id: 'CAM-017', name: 'Idgah Hills',          location: 'Idgah Hills, Bhopal',       latitude: 23.2620, longitude: 77.3950, status: 'degraded', fps: 12, vehicle_count: 8,  congestion_level: 'low'    },
  { camera_id: 'CAM-018', name: 'Shyamla Hills',        location: 'Shyamla Hills, Bhopal',     latitude: 23.2450, longitude: 77.3850, status: 'active',   fps: 25, vehicle_count: 34, congestion_level: 'low'    },
  { camera_id: 'CAM-019', name: 'Sehore Road',          location: 'Sehore Road, Bhopal',       latitude: 23.2200, longitude: 77.3700, status: 'active',   fps: 25, vehicle_count: 27, congestion_level: 'low'    },
  { camera_id: 'CAM-020', name: 'Bhanpur',              location: 'Bhanpur, Bhopal',           latitude: 23.1650, longitude: 77.4700, status: 'active',   fps: 25, vehicle_count: 31, congestion_level: 'low'    },
  { camera_id: 'CAM-021', name: 'Misrod',               location: 'Misrod, Bhopal',            latitude: 23.1500, longitude: 77.4600, status: 'active',   fps: 25, vehicle_count: 22, congestion_level: 'low'    },
  { camera_id: 'CAM-022', name: 'Bairagarh',            location: 'Bairagarh, Bhopal',         latitude: 23.3200, longitude: 77.3600, status: 'active',   fps: 25, vehicle_count: 44, congestion_level: 'medium' },
  { camera_id: 'CAM-023', name: 'Pipalner',             location: 'Pipalner Square, Bhopal',   latitude: 23.2800, longitude: 77.4400, status: 'active',   fps: 25, vehicle_count: 38, congestion_level: 'low'    },
  { camera_id: 'CAM-024', name: 'Vidhan Sabha',         location: 'Vidhan Sabha Road, Bhopal', latitude: 23.2560, longitude: 77.4010, status: 'active',   fps: 30, vehicle_count: 61, congestion_level: 'medium' },
];

export const VEHICLES: Vehicle[] = [
  { vehicle_id: 'V-1042', license_plate: 'MP04AB1234', vehicle_type: 'Sedan',    color: 'White',  first_seen: '10:02:14', last_seen: '10:24:51', confidence: 97.2, cameras_visited: 4 },
  { vehicle_id: 'V-0891', license_plate: 'MP04XY7788', vehicle_type: 'SUV',      color: 'Black',  first_seen: '10:09:32', last_seen: '10:14:11', confidence: 95.1, cameras_visited: 2 },
  { vehicle_id: 'V-0234', license_plate: 'MP09CD5566', vehicle_type: 'Hatchback', color: 'Silver', first_seen: '09:41:22', last_seen: '10:18:05', confidence: 93.8, cameras_visited: 3 },
  { vehicle_id: 'V-0567', license_plate: 'MP04GH3311', vehicle_type: 'Bus',       color: 'Red',    first_seen: '08:15:00', last_seen: '11:02:38', confidence: 98.3, cameras_visited: 6 },
  { vehicle_id: 'V-0678', license_plate: 'MP40PQ9900', vehicle_type: 'Truck',     color: 'Blue',   first_seen: '07:30:11', last_seen: '09:44:52', confidence: 91.5, cameras_visited: 5 },
  { vehicle_id: 'V-0789', license_plate: 'MP04RS2244', vehicle_type: 'Bike',      color: 'Black',  first_seen: '10:21:44', last_seen: '10:28:19', confidence: 89.6, cameras_visited: 2 },
  { vehicle_id: 'V-0345', license_plate: 'MP20LM6677', vehicle_type: 'Sedan',    color: 'Grey',   first_seen: '09:55:17', last_seen: '10:31:08', confidence: 96.2, cameras_visited: 3 },
  { vehicle_id: 'V-0456', license_plate: 'MP04TU4488', vehicle_type: 'SUV',      color: 'White',  first_seen: '10:05:49', last_seen: '10:22:33', confidence: 94.7, cameras_visited: 3 },
];

export const DEMO_DETECTIONS: Detection[] = [
  { detection_id: 'DET-DEMO-001', vehicle_id: 'V-1042', camera_id: 'CAM-001', camera_name: 'MP Nagar Junction',   camera_location: 'MP Nagar, Bhopal',         latitude: 23.2337, longitude: 77.4325, timestamp: '10:02:14', plate: 'MP04AB1234', plate_confidence: 98.1, vehicle_confidence: 97.6, vehicle_type: 'Sedan', color: 'White' },
  { detection_id: 'DET-DEMO-002', vehicle_id: 'V-1042', camera_id: 'CAM-002', camera_name: 'Board Office Square', camera_location: 'Board Office, Bhopal',      latitude: 23.2441, longitude: 77.4073, timestamp: '10:08:42', plate: 'MP04AB1234', plate_confidence: 96.4, vehicle_confidence: 95.9, vehicle_type: 'Sedan', color: 'White' },
  { detection_id: 'DET-DEMO-003', vehicle_id: 'V-1042', camera_id: 'CAM-003', camera_name: 'Habibganj Junction',  camera_location: 'Habibganj, Bhopal',         latitude: 23.2298, longitude: 77.4341, timestamp: '10:16:18', plate: 'MP04AB1234', plate_confidence: 94.7, vehicle_confidence: 96.3, vehicle_type: 'Sedan', color: 'White' },
  { detection_id: 'DET-DEMO-004', vehicle_id: 'V-1042', camera_id: 'CAM-005', camera_name: 'Airport Road',        camera_location: 'Raja Bhoj Airport, Bhopal', latitude: 23.2876, longitude: 77.3370, timestamp: '10:24:51', plate: 'MP04AB1234', plate_confidence: 97.2, vehicle_confidence: 98.1, vehicle_type: 'Sedan', color: 'White' },
];

export const ALERTS: Alert[] = [
  { alert_id: 'ALT-001', severity: 'critical', title: 'Suspicious Vehicle Movement',       description: 'MP04XY7788 detected at CAM-002 and CAM-006 within an unusually short 4-minute interval — possible speed violation or route anomaly.',      camera_id: 'CAM-006', vehicle_id: 'V-0891', timestamp: '10:14:22', status: 'active' },
  { alert_id: 'ALT-002', severity: 'warning',  title: 'Congestion Alert — Board Office Road', description: 'Traffic density 42% above normal threshold. Average speed dropped to 8 km/h. Consider signal re-timing.',                                 camera_id: 'CAM-002', vehicle_id: undefined, timestamp: '10:31:05', status: 'active' },
  { alert_id: 'ALT-003', severity: 'warning',  title: 'Low ANPR Confidence Detected',      description: 'Plate recognition confidence dropped to 61% on CAM-004. Possible lens obstruction, dust, or weather interference.',                          camera_id: 'CAM-004', vehicle_id: undefined, timestamp: '10:22:17', status: 'active' },
  { alert_id: 'ALT-004', severity: 'info',     title: 'Camera Health Degraded — CAM-017',  description: 'CAM-017 (Idgah Hills) FPS dropped to 12 fps, below the 20 fps minimum threshold. Maintenance team notified.',                               camera_id: 'CAM-017', vehicle_id: undefined, timestamp: '09:48:33', status: 'active' },
  { alert_id: 'ALT-005', severity: 'warning',  title: 'Watchlist Plate Detected',           description: 'License plate MP09XX9999 matched against the restricted-vehicle watchlist at CAM-009 (Berasia Road). Flagged for review.',                  camera_id: 'CAM-009', vehicle_id: undefined, timestamp: '10:45:11', status: 'active' },
  { alert_id: 'ALT-006', severity: 'info',     title: 'Unusual Route Pattern — V-0567',    description: 'Bus MP04GH3311 (V-0567) deviated from expected school-route corridor. Last 3 detections inconsistent with normal movement pattern.',         camera_id: 'CAM-013', vehicle_id: 'V-0567', timestamp: '11:02:38', status: 'active' },
];

export const TRAFFIC_VOLUME: TrafficVolume[] = [
  { hour: '06:00', vehicles: 142, speed: 48.2 },
  { hour: '07:00', vehicles: 284, speed: 38.1 },
  { hour: '08:00', vehicles: 521, speed: 19.4 },
  { hour: '09:00', vehicles: 583, speed: 14.8 },
  { hour: '10:00', vehicles: 412, speed: 26.3 },
  { hour: '11:00', vehicles: 318, speed: 31.7 },
  { hour: '12:00', vehicles: 376, speed: 28.9 },
  { hour: '13:00', vehicles: 342, speed: 30.1 },
  { hour: '14:00', vehicles: 298, speed: 33.4 },
  { hour: '15:00', vehicles: 334, speed: 31.2 },
  { hour: '16:00', vehicles: 398, speed: 27.6 },
  { hour: '17:00', vehicles: 548, speed: 16.2 },
  { hour: '18:00', vehicles: 612, speed: 11.8 },
  { hour: '19:00', vehicles: 489, speed: 21.3 },
  { hour: '20:00', vehicles: 287, speed: 35.8 },
  { hour: '21:00', vehicles: 198, speed: 42.1 },
  { hour: '22:00', vehicles: 134, speed: 49.3 },
  { hour: '23:00', vehicles: 87,  speed: 54.6 },
];

export const VEHICLE_TYPES: VehicleType[] = [
  { type: 'Cars',  count: 6840, percentage: 54.8 },
  { type: 'Bikes', count: 3120, percentage: 25.0 },
  { type: 'Buses', count: 748,  percentage: 6.0  },
  { type: 'Trucks',count: 623,  percentage: 5.0  },
  { type: 'Auto',  count: 1155, percentage: 9.2  },
];

export const CONGESTION_DATA: CongestionData[] = [
  { road: 'MP Nagar Junction',   camera: 'CAM-001', level: 'medium', score: 58 },
  { road: 'Board Office Road',   camera: 'CAM-002', level: 'high',   score: 84 },
  { road: 'Habibganj Junction',  camera: 'CAM-003', level: 'medium', score: 62 },
  { road: 'Lalghati',            camera: 'CAM-004', level: 'low',    score: 28 },
  { road: 'Airport Road',        camera: 'CAM-005', level: 'low',    score: 22 },
  { road: 'BHEL Square',         camera: 'CAM-006', level: 'high',   score: 78 },
  { road: 'New Market',          camera: 'CAM-007', level: 'medium', score: 55 },
  { road: 'Roshanpura Chowk',    camera: 'CAM-008', level: 'high',   score: 81 },
];

export const FLOW_DATA: FlowData[] = [
  { from: 'CAM-001', from_name: 'MP Nagar',    to: 'CAM-002', to_name: 'Board Office', count: 1284 },
  { from: 'CAM-002', from_name: 'Board Office',to: 'CAM-003', to_name: 'Habibganj',    count: 942  },
  { from: 'CAM-003', from_name: 'Habibganj',   to: 'CAM-005', to_name: 'Airport Road', count: 687  },
  { from: 'CAM-001', from_name: 'MP Nagar',    to: 'CAM-007', to_name: 'New Market',   count: 812  },
  { from: 'CAM-004', from_name: 'Lalghati',    to: 'CAM-005', to_name: 'Airport Road', count: 534  },
  { from: 'CAM-002', from_name: 'Board Office',to: 'CAM-006', to_name: 'BHEL Square',  count: 421  },
];
