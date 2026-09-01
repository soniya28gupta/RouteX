import React, { useCallback, useEffect, useRef } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ToastContainer, useToastController, toast } from './components/Toast';
import { useSimStore } from './store/simulationStore';
import { runFrontendSimulation } from './services/simulation';
import { api } from './services/api';
import type { NavPage } from './types';

import Overview from './pages/Overview';
import LiveCameras from './pages/LiveCameras';
import VehicleTracking from './pages/VehicleTracking';
import ANPRSearch from './pages/ANPRSearch';
import TrajectoryExplorer from './pages/TrajectoryExplorer';
import TrafficAnalytics from './pages/TrafficAnalytics';
import Alerts from './pages/Alerts';
import CameraNetwork from './pages/CameraNetwork';
import SystemHealth from './pages/SystemHealth';

import { useState } from 'react';

function App() {
  const [page, setPage] = useState<NavPage>('overview');
  const { toasts, addToast, dismiss } = useToastController();
  const { isRunning, startSim, stopSim, pushEvent, reset, newAlerts } = useSimStore();
  const stopSimRef = useRef<(() => void) | null>(null);

  const handleStartSim = useCallback(async () => {
    if (isRunning) return;
    reset();
    startSim();
    await api.startSimulation();

    toast({ type: 'info', title: 'AI Simulation Started', message: 'Tracking MP04AB1234 across 4 cameras…' });

    stopSimRef.current = runFrontendSimulation(
      (event) => {
        pushEvent(event);

        if (event.event_type === 'vehicle_detected') {
          toast({ type: 'info', title: `Vehicle Detected — ${event.camera_id}`, message: `Plate: ${event.plate} · Conf: ${event.plate_confidence?.toFixed(1)}%` });
        }
        if (event.event_type === 'cross_camera_match') {
          toast({ type: 'success', title: `Cross-Camera Match!`, message: `${event.plate} matched at ${event.camera_id} · ${event.match_confidence?.toFixed(1)}% confidence` });
        }
        if (event.event_type === 'alert_triggered') {
          toast({ type: 'warning', title: event.alert?.title ?? 'Alert', message: event.camera_id });
        }
        if (event.event_type === 'trajectory_updated') {
          toast({ type: 'success', title: 'Trajectory Complete', message: 'CAM-001 → CAM-002 → CAM-003 → CAM-005' });
        }
      },
      () => {
        stopSim();
        toast({ type: 'success', title: 'Simulation Complete', message: 'Full journey reconstructed for MP04AB1234' });
      }
    );
  }, [isRunning, reset, startSim, stopSim, pushEvent]);

  const handleStopSim = useCallback(() => {
    stopSimRef.current?.();
    stopSimRef.current = null;
    stopSim();
    api.stopSimulation();
    toast({ type: 'info', title: 'Simulation Stopped' });
  }, [stopSim]);

  const renderPage = () => {
    switch (page) {
      case 'overview':    return <Overview onNav={setPage} />;
      case 'cameras':     return <LiveCameras />;
      case 'tracking':    return <VehicleTracking onNav={setPage} />;
      case 'anpr':        return <ANPRSearch onNav={setPage} />;
      case 'trajectory':  return <TrajectoryExplorer />;
      case 'analytics':   return <TrafficAnalytics />;
      case 'alerts':      return <Alerts />;
      case 'network':     return <CameraNetwork />;
      case 'health':      return <SystemHealth />;
      default:            return <Overview onNav={setPage} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080c14' }}>
      <Sidebar current={page} onNav={setPage} simRunning={isRunning} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          page={page}
          simRunning={isRunning}
          onStartSim={handleStartSim}
          onStopSim={handleStopSim}
          alertCount={newAlerts.length + 6}
          onNav={setPage}
        />
        <main style={{ flex: 1, overflow: 'hidden' }}>
          {renderPage()}
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

export default App;
