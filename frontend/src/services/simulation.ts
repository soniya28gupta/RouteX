// CityVision AI — Frontend Simulation Engine
// Drives the demo flow entirely in the browser — no backend required.

import type { SimEvent } from '../types';

const DEMO_STEPS: SimEvent[] = [
  { event_type: 'vehicle_detected',   camera_id: 'CAM-001', camera_name: 'MP Nagar Junction',   vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 98.1, vehicle_confidence: 97.6, timestamp: '10:02:14' },
  { event_type: 'plate_recognized',   camera_id: 'CAM-001', camera_name: 'MP Nagar Junction',   vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 98.1, vehicle_confidence: 97.6, timestamp: '10:02:16' },
  { event_type: 'background_detection', camera_id: 'CAM-002', camera_name: 'Board Office Square', vehicle_id: 'V-BG1', plate: 'MP04GH3311', plate_confidence: 94.2, vehicle_confidence: 93.1, timestamp: '10:03:10' },
  { event_type: 'background_detection', camera_id: 'CAM-003', camera_name: 'Habibganj Junction',  vehicle_id: 'V-BG2', plate: 'MP40PQ9900', plate_confidence: 91.8, vehicle_confidence: 92.4, timestamp: '10:04:22' },
  { event_type: 'vehicle_detected',   camera_id: 'CAM-002', camera_name: 'Board Office Square', vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 96.4, vehicle_confidence: 95.9, timestamp: '10:08:42' },
  { event_type: 'cross_camera_match', camera_id: 'CAM-002', camera_name: 'Board Office Square', vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 96.4, vehicle_confidence: 95.9, match_confidence: 96.4, timestamp: '10:08:44' },
  { event_type: 'background_detection', camera_id: 'CAM-004', camera_name: 'Lalghati',            vehicle_id: 'V-BG3', plate: 'MP04RS2244', plate_confidence: 88.9, vehicle_confidence: 87.6, timestamp: '10:09:31' },
  { event_type: 'vehicle_detected',   camera_id: 'CAM-003', camera_name: 'Habibganj Junction',  vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 94.7, vehicle_confidence: 96.3, timestamp: '10:16:18' },
  { event_type: 'cross_camera_match', camera_id: 'CAM-003', camera_name: 'Habibganj Junction',  vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 94.7, vehicle_confidence: 96.3, match_confidence: 95.1, timestamp: '10:16:20' },
  { event_type: 'vehicle_detected',   camera_id: 'CAM-005', camera_name: 'Airport Road',        vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 97.2, vehicle_confidence: 98.1, timestamp: '10:24:51' },
  { event_type: 'trajectory_updated', camera_id: 'CAM-005', camera_name: 'Airport Road',        vehicle_id: 'V-1042', plate: 'MP04AB1234', plate_confidence: 97.2, vehicle_confidence: 98.1, cameras_visited: ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-005'], timestamp: '10:24:53' },
  { event_type: 'alert_triggered', timestamp: '10:25:00', alert: {
    alert_id: 'ALT-SIM-001', severity: 'warning',
    title: 'Congestion Alert — Board Office Road',
    description: 'Traffic density 42% above normal. Average speed dropped to 8 km/h.',
    camera_id: 'CAM-002', timestamp: '10:25:00', status: 'active',
  }},
  { event_type: 'simulation_complete', vehicle_id: 'V-1042', plate: 'MP04AB1234', cameras_visited: ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-005'], timestamp: '10:25:05' },
];

const DELAYS_MS = [500, 2000, 1500, 1500, 3000, 1500, 1500, 3500, 1500, 4000, 1500, 2000, 2000];

export function runFrontendSimulation(onEvent: (e: SimEvent) => void, onDone: () => void) {
  let cancelled = false;
  let idx = 0;

  async function next() {
    if (cancelled || idx >= DEMO_STEPS.length) {
      onDone();
      return;
    }
    const step = DEMO_STEPS[idx];
    onEvent(step);
    const delay = DELAYS_MS[idx] ?? 2000;
    idx++;
    setTimeout(next, delay);
  }

  // start immediately
  setTimeout(next, 400);

  return () => { cancelled = true; };
}
