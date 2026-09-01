import React, { useEffect, useState } from 'react';
import { Play, Square, Shield, Bell } from 'lucide-react';
import type { NavPage } from '../../types';

interface Props {
  page: NavPage;
  simRunning: boolean;
  onStartSim: () => void;
  onStopSim: () => void;
  alertCount: number;
  onNav: (p: NavPage) => void;
}

const PAGE_LABELS: Record<NavPage, string> = {
  overview: 'Overview Dashboard',
  cameras: 'Live Camera Feeds',
  tracking: 'Vehicle Intelligence',
  anpr: 'ANPR Search',
  trajectory: 'Trajectory Explorer',
  analytics: 'Traffic Analytics',
  alerts: 'Alerts & Anomalies',
  network: 'Camera Network',
  health: 'System Health',
};

export function TopBar({ page, simRunning, onStartSim, onStopSim, alertCount, onNav }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={{
      height: 54,
      background: '#0a1120',
      borderBottom: '1px solid #1e2d42',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
      flexShrink: 0,
    }}>
      {/* Breadcrumb */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{PAGE_LABELS[page]}</div>
        <div style={{ fontSize: 10, color: '#2a3f5c', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>
          Multi-Camera ANPR · Vehicle Intelligence · Urban Traffic Analytics
        </div>
      </div>

      {/* Time */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        color: '#94a3b8',
        background: '#080c14',
        border: '1px solid #1e2d42',
        borderRadius: 6,
        padding: '4px 10px',
        letterSpacing: '0.05em',
      }}>
        {time.toLocaleTimeString('en-IN', { hour12: false })} IST
      </div>

      {/* Alerts button */}
      <button
        onClick={() => onNav('alerts')}
        style={{
          position: 'relative',
          background: alertCount > 0 ? 'rgba(239,68,68,0.08)' : '#080c14',
          border: `1px solid ${alertCount > 0 ? 'rgba(239,68,68,0.3)' : '#1e2d42'}`,
          borderRadius: 6,
          padding: '6px 10px',
          cursor: 'pointer',
          color: alertCount > 0 ? '#ef4444' : '#4b6280',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12,
        }}
      >
        <Bell size={13} />
        {alertCount > 0 && (
          <span style={{ fontWeight: 700 }}>{alertCount}</span>
        )}
        {alertCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 8, height: 8, borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 6px #ef4444',
          }} className="pulse-live" />
        )}
      </button>

      {/* Sim button */}
      {simRunning ? (
        <button
          onClick={onStopSim}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 14px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 7,
            color: '#ef4444',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Square size={12} />
          Stop Simulation
        </button>
      ) : (
        <button
          onClick={onStartSim}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 14px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(59,130,246,0.15))',
            border: '1px solid rgba(0,212,255,0.4)',
            borderRadius: 7,
            color: '#00d4ff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(0,212,255,0.1)',
          }}
        >
          <Play size={12} style={{ fill: '#00d4ff' }} />
          ▶ Start AI Simulation
        </button>
      )}

      {/* Shield */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2a3f5c', fontSize: 11 }}>
        <Shield size={12} />
        <span>Secure</span>
      </div>
    </header>
  );
}
