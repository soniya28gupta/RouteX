import React from 'react';
import {
  LayoutDashboard, Video, Car, Search, Map, BarChart3,
  AlertTriangle, Network, Activity, Cpu, Radio, Clock
} from 'lucide-react';
import type { NavPage } from '../../types';

interface Props {
  current: NavPage;
  onNav: (p: NavPage) => void;
  simRunning: boolean;
}

const NAV_ITEMS: { id: NavPage; label: string; icon: React.ElementType }[] = [
  { id: 'overview',    label: 'Overview',           icon: LayoutDashboard },
  { id: 'cameras',    label: 'Live Cameras',        icon: Video           },
  { id: 'tracking',  label: 'Vehicle Tracking',    icon: Car             },
  { id: 'anpr',      label: 'ANPR Search',         icon: Search          },
  { id: 'trajectory',label: 'Trajectory Explorer', icon: Map             },
  { id: 'analytics', label: 'Traffic Analytics',   icon: BarChart3       },
  { id: 'alerts',    label: 'Alerts',              icon: AlertTriangle   },
  { id: 'network',   label: 'Camera Network',      icon: Network         },
  { id: 'health',    label: 'System Health',       icon: Activity        },
];

export function Sidebar({ current, onNav, simRunning }: Props) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });

  return (
    <aside
      style={{ width: 220, minWidth: 220, background: '#0a1120', borderRight: '1px solid #1e2d42', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1e2d42' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #00d4ff22, #3b82f622)',
            border: '1px solid #00d4ff44',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Cpu size={18} color="#00d4ff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.02em' }}>CityVision AI</div>
            <div style={{ fontSize: 9.5, color: '#4b6280', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 1 }}>Traffic Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: '#2a3f5c', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Navigation</div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`nav-item ${current === id ? 'active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', borderLeft: current === id ? '2px solid #00d4ff' : '2px solid transparent' }}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom status */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #1e2d42', fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: simRunning ? '#10b981' : '#00d4ff', boxShadow: `0 0 6px ${simRunning ? '#10b981' : '#00d4ff'}` }} className={simRunning ? 'pulse-live' : ''} />
          <span style={{ color: '#4b6280' }}>AI Engine: </span>
          <span style={{ color: simRunning ? '#10b981' : '#00d4ff', fontWeight: 600 }}>{simRunning ? 'Processing' : 'Online'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Radio size={11} color="#4b6280" />
          <span style={{ color: '#4b6280' }}>Cameras: </span>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>23/24 Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={11} color="#4b6280" />
          <span style={{ color: '#4b6280' }}>Sync: </span>
          <span style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{timeStr}</span>
        </div>
        <div style={{ marginTop: 12, padding: '6px 10px', background: '#080c14', borderRadius: 6, border: '1px solid #1e2d42' }}>
          <div style={{ fontSize: 9, color: '#2a3f5c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>SIH26127</div>
          <div style={{ fontSize: 9.5, color: '#4b6280' }}>Prototype v1.0.0 · Demo Mode</div>
        </div>
      </div>
    </aside>
  );
}
