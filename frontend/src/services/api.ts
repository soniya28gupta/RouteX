// CityVision AI — API Service (with standalone fallback)
import type { Camera, Vehicle, Detection, Trajectory, Alert } from '../types';
import * as seed from '../data/seedData';

const BASE = '/api';
const USE_SEED = true; // Set false when backend is available

async function fetchJSON<T>(url: string, fallback: T): Promise<T> {
  if (USE_SEED) return fallback;
  try {
    const r = await fetch(BASE + url);
    if (!r.ok) return fallback;
    return r.json();
  } catch {
    return fallback;
  }
}

export const api = {
  getCameras: (): Promise<Camera[]> =>
    fetchJSON('/cameras', seed.CAMERAS),

  getCamera: (id: string): Promise<Camera | null> =>
    fetchJSON(`/cameras/${id}`, seed.CAMERAS.find(c => c.camera_id === id) ?? null),

  getCameraDetections: (id: string): Promise<Detection[]> =>
    fetchJSON(`/cameras/${id}/detections`, seed.DEMO_DETECTIONS.filter(d => d.camera_id === id)),

  getVehicles: (): Promise<Vehicle[]> =>
    fetchJSON('/vehicles', seed.VEHICLES),

  searchVehicle: async (q: string): Promise<Vehicle | null> => {
    if (USE_SEED) {
      const up = q.toUpperCase().trim();
      return seed.VEHICLES.find(v => v.license_plate.toUpperCase().includes(up) || v.vehicle_id.toUpperCase().includes(up)) ?? null;
    }
    try {
      const r = await fetch(`${BASE}/vehicles/${encodeURIComponent(q)}`);
      if (!r.ok) return null;
      const data = await r.json();
      return data.error ? null : data;
    } catch { return null; }
  },

  getVehicleDetections: (id: string): Promise<Detection[]> =>
    fetchJSON(`/vehicles/${encodeURIComponent(id)}/detections`,
      seed.DEMO_DETECTIONS.filter(d =>
        d.vehicle_id === id ||
        seed.VEHICLES.find(v => v.license_plate.toUpperCase() === id.toUpperCase())?.vehicle_id === d.vehicle_id
      )
    ),

  getVehicleTrajectory: (id: string): Promise<Trajectory | null> => {
    const traj: Trajectory = {
      trajectory_id: 'TRJ-DEMO-001',
      vehicle_id: 'V-1042',
      camera_sequence: ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-005'],
      timestamps: ['10:02:14', '10:08:42', '10:16:18', '10:24:51'],
      distance: 12.4,
      duration: 1357,
    };
    return fetchJSON(`/vehicles/${encodeURIComponent(id)}/trajectory`, traj);
  },

  getAlerts: (): Promise<Alert[]> =>
    fetchJSON('/alerts', seed.ALERTS),

  getTrafficVolume: () =>
    fetchJSON('/analytics/traffic-volume', { data: seed.TRAFFIC_VOLUME, peak_morning: '08:00–10:00', peak_evening: '17:00–19:00' }),

  getVehicleTypes: () =>
    fetchJSON('/analytics/vehicle-types', { data: seed.VEHICLE_TYPES }),

  getCongestion: () =>
    fetchJSON('/analytics/congestion', { data: seed.CONGESTION_DATA, congested_count: 3 }),

  getFlow: () =>
    fetchJSON('/analytics/flow', { data: seed.FLOW_DATA }),

  getSummary: () =>
    fetchJSON('/analytics/summary', {
      total_vehicles: 12486,
      unique_vehicles: 8932,
      anpr_accuracy: 96.8,
      active_cameras: 24,
      total_cameras: 24,
      average_speed: 34.2,
      congested_roads: 7,
      alerts_today: 6,
    }),

  startSimulation: async () => {
    if (USE_SEED) return { status: 'started' };
    try { return (await fetch(`${BASE}/simulation/start`, { method: 'POST' })).json(); }
    catch { return { status: 'started' }; }
  },

  stopSimulation: async () => {
    if (USE_SEED) return { status: 'stopped' };
    try { return (await fetch(`${BASE}/simulation/stop`, { method: 'POST' })).json(); }
    catch { return { status: 'stopped' }; }
  },
};
