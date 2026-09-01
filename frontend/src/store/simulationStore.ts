// CityVision AI — Zustand Simulation Store
import { create } from 'zustand';
import type { SimEvent, Detection, Alert } from '../types';

interface ActiveDetection {
  camera_id: string;
  camera_name: string;
  plate: string;
  vehicle_id: string;
  plate_confidence: number;
  vehicle_confidence: number;
  event_type: string;
}

interface SimulationState {
  isRunning: boolean;
  step: number;
  events: SimEvent[];
  activeDetections: ActiveDetection[];
  matchedVehicle: string | null;
  matchConfidence: number | null;
  visitedCameras: string[];
  newAlerts: Alert[];

  // Demo state
  demoCameraIndex: number; // which demo camera is currently active (0–3)

  // Actions
  startSim: () => void;
  stopSim: () => void;
  pushEvent: (event: SimEvent) => void;
  reset: () => void;
}

export const useSimStore = create<SimulationState>((set) => ({
  isRunning: false,
  step: 0,
  events: [],
  activeDetections: [],
  matchedVehicle: null,
  matchConfidence: null,
  visitedCameras: [],
  newAlerts: [],
  demoCameraIndex: -1,

  startSim: () => set({ isRunning: true, step: 0, events: [], activeDetections: [], matchedVehicle: null, matchConfidence: null, visitedCameras: [], newAlerts: [], demoCameraIndex: -1 }),

  stopSim: () => set({ isRunning: false }),

  pushEvent: (event: SimEvent) =>
    set((state) => {
      const events = [event, ...state.events].slice(0, 100);
      let patch: Partial<SimulationState> = { events, step: state.step + 1 };

      if (event.event_type === 'vehicle_detected' || event.event_type === 'plate_recognized') {
        const det: ActiveDetection = {
          camera_id: event.camera_id!,
          camera_name: event.camera_name!,
          plate: event.plate!,
          vehicle_id: event.vehicle_id!,
          plate_confidence: event.plate_confidence!,
          vehicle_confidence: event.vehicle_confidence!,
          event_type: event.event_type,
        };
        const existing = state.activeDetections.filter(d => d.camera_id !== det.camera_id);
        patch.activeDetections = [...existing, det];

        // Update demo camera index for the 4 demo cams
        const demoCams = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-005'];
        const idx = demoCams.indexOf(event.camera_id!);
        if (idx >= 0) patch.demoCameraIndex = idx;
      }

      if (event.event_type === 'cross_camera_match') {
        patch.matchedVehicle = event.plate ?? null;
        patch.matchConfidence = event.match_confidence ?? null;
      }

      if (event.event_type === 'trajectory_updated' && event.cameras_visited) {
        patch.visitedCameras = event.cameras_visited;
      }

      if (event.event_type === 'alert_triggered' && event.alert) {
        patch.newAlerts = [event.alert, ...state.newAlerts].slice(0, 10);
      }

      if (event.event_type === 'simulation_complete') {
        patch.isRunning = false;
      }

      return patch;
    }),

  reset: () =>
    set({
      isRunning: false,
      step: 0,
      events: [],
      activeDetections: [],
      matchedVehicle: null,
      matchConfidence: null,
      visitedCameras: [],
      newAlerts: [],
      demoCameraIndex: -1,
    }),
}));
