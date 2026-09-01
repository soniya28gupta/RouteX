import React, { useState } from 'react';
import { CAMERAS } from '../data/seedData';
import { CheckCircle, AlertTriangle, XCircle, Activity, Camera, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Re-ID Pipeline Visual
// ─────────────────────────────────────────────────────────────────────────────
function ReIDExplainer() {
  return (
    <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
        Vehicle Re-Identification Process
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto' }}>
        {[
          { cam: 'CAM-001', plate: 'MP04AB1234', loc: 'MP Nagar', conf: 98.1 },
          null,
          { cam: 'CAM-002', plate: 'MP04AB1234', loc: 'Board Office', conf: 96.4, match: 96.4 },
        ].map((item, i) => {
          if (!item) {
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: '#4b6280', marginBottom: 8, textAlign: 'center', lineHeight: 1.6 }}>
                  Feature Extraction<br />
                  <span style={{ color: '#2a3f5c' }}>↓</span><br />
                  Plate + Appearance<br />
                  + Time + Location<br />
                  <span style={{ color: '#2a3f5c' }}>↓</span><br />
                  Cross-Camera Match
                </div>
                <ArrowRight size={20} color="#3b82f6" />
              </div>
            );
          }
          return (
            <div key={i} style={{ flexShrink: 0, width: 180, background: '#111827', border: '1px solid #1e2d42', borderRadius: 10, padding: 14 }}>
              {/* Camera snapshot placeholder */}
              <div style={{ height: 80, background: '#080c14', borderRadius: 7, border: '1px solid #1e2d42', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, position: 'relative' }}>
                <Camera size={20} color="#2a3f5c" />
                <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 8, color: '#2a3f5c', fontFamily: 'JetBrains Mono, monospace' }}>{item.cam}</div>
              </div>

              <div style={{ fontSize: 10, color: '#4b6280', marginBottom: 2 }}>{item.cam} · {item.loc}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', marginBottom: 8 }}>{item.plate}</div>
              <div style={{ fontSize: 10, color: '#4b6280', marginBottom: 2 }}>Plate Conf.: <span style={{ color: '#10b981' }}>{item.conf}%</span></div>

              {item.match && (
                <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981' }}>MATCH CONFIDENCE</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{item.match}%</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Match factors */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { factor: 'License Plate Similarity', value: '98.1%', color: '#00d4ff' },
          { factor: 'Vehicle Appearance',        value: '94.2%', color: '#3b82f6' },
          { factor: 'Color Match',               value: '96.8%', color: '#8b5cf6' },
          { factor: 'Vehicle Type Match',        value: '99.0%', color: '#10b981' },
          { factor: 'Temporal Consistency',      value: '✓ Valid', color: '#f59e0b' },
          { factor: 'Spatial Consistency',       value: '✓ Valid', color: '#f97316' },
        ].map(({ factor, value, color }) => (
          <div key={factor} style={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: 7, padding: '8px 12px' }}>
            <div style={{ fontSize: 9.5, color: '#4b6280', marginBottom: 4 }}>{factor}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Camera Network Map (SVG-based topology)
// ─────────────────────────────────────────────────────────────────────────────
function CameraTopology() {
  const nodes = [
    { id: 'CAM-001', name: 'MP Nagar',    x: 200, y: 180 },
    { id: 'CAM-002', name: 'Bd. Office',  x: 120, y: 100 },
    { id: 'CAM-003', name: 'Habibganj',   x: 300, y: 100 },
    { id: 'CAM-004', name: 'Lalghati',    x: 60,  y: 200 },
    { id: 'CAM-005', name: 'Airport Rd',  x: 60,  y: 300 },
    { id: 'CAM-006', name: 'BHEL Sq.',    x: 200, y: 300 },
    { id: 'CAM-007', name: 'New Market',  x: 340, y: 220 },
    { id: 'CAM-008', name: 'Roshanpura', x: 280, y: 300 },
  ];
  const edges = [
    ['CAM-001', 'CAM-002'], ['CAM-001', 'CAM-003'],
    ['CAM-001', 'CAM-006'], ['CAM-002', 'CAM-004'],
    ['CAM-004', 'CAM-005'], ['CAM-003', 'CAM-007'],
    ['CAM-006', 'CAM-008'], ['CAM-001', 'CAM-007'],
  ];
  const demoEdges = [['CAM-001', 'CAM-002'], ['CAM-002', 'CAM-003'], ['CAM-003', 'CAM-005']];

  function getNode(id: string) { return nodes.find(n => n.id === id)!; }

  return (
    <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 12 }}>Camera Network Topology</div>
      <svg width="100%" viewBox="0 0 400 380" style={{ overflow: 'visible' }}>
        {/* Regular edges */}
        {edges.map(([a, b]) => {
          const na = getNode(a), nb = getNode(b);
          if (!na || !nb) return null;
          const isDemo = demoEdges.some(([da, db]) => (da === a && db === b) || (da === b && db === a));
          return (
            <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={isDemo ? '#00d4ff' : '#1e2d42'}
              strokeWidth={isDemo ? 2 : 1}
              strokeDasharray={isDemo ? '6 3' : undefined}
              opacity={isDemo ? 0.8 : 0.5} />
          );
        })}
        {/* Nodes */}
        {nodes.map(n => {
          const demoSet = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-005'];
          const isDemo = demoSet.includes(n.id);
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={isDemo ? 14 : 10}
                fill={isDemo ? '#00d4ff22' : '#111827'}
                stroke={isDemo ? '#00d4ff' : '#2a3f5c'}
                strokeWidth={isDemo ? 2 : 1} />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fill={isDemo ? '#00d4ff' : '#4b6280'} fontFamily="JetBrains Mono, monospace">
                {n.id.split('-')[1]}
              </text>
              <text x={n.x} y={n.y + (isDemo ? 22 : 18)} textAnchor="middle"
                fontSize={8} fill={isDemo ? '#94a3b8' : '#2a3f5c'} fontFamily="Inter, sans-serif">
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, fontSize: 10, color: '#4b6280' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 20, height: 2, background: '#00d4ff' }} />
          Demo route (MP04AB1234)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 20, height: 1, background: '#2a3f5c' }} />
          Network link
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Camera List Table
// ─────────────────────────────────────────────────────────────────────────────
function CameraTable() {
  return (
    <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e2d42' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>Camera Network Status</div>
        <div style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>24 cameras · 23 active · 1 degraded</div>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 300 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #111827', background: '#0a1120' }}>
              {['ID', 'Name', 'Location', 'Status', 'FPS', 'Vehicles', 'Congestion'].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 9.5, fontWeight: 600, color: '#2a3f5c', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAMERAS.map(cam => {
              const statusColor = cam.status === 'active' ? '#10b981' : cam.status === 'degraded' ? '#f59e0b' : '#ef4444';
              const congColor = cam.congestion_level === 'high' ? '#ef4444' : cam.congestion_level === 'medium' ? '#f59e0b' : '#10b981';
              return (
                <tr key={cam.camera_id} style={{ borderBottom: '1px solid #0d1421' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#111827'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <td style={{ padding: '8px 14px', fontSize: 10, color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace' }}>{cam.camera_id}</td>
                  <td style={{ padding: '8px 14px', fontSize: 11, color: '#f1f5f9' }}>{cam.name}</td>
                  <td style={{ padding: '8px 14px', fontSize: 10, color: '#4b6280' }}>{cam.location.split(', ')[0]}</td>
                  <td style={{ padding: '8px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                      <span style={{ fontSize: 10, color: statusColor, textTransform: 'capitalize' }}>{cam.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '8px 14px', fontSize: 11, color: cam.fps < 20 ? '#f59e0b' : '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{cam.fps}</td>
                  <td style={{ padding: '8px 14px', fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{cam.vehicle_count}</td>
                  <td style={{ padding: '8px 14px' }}>
                    <span style={{ fontSize: 10, color: congColor, textTransform: 'capitalize', background: `${congColor}18`, border: `1px solid ${congColor}30`, borderRadius: 4, padding: '1px 6px' }}>
                      {cam.congestion_level}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CameraNetwork() {
  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Camera Network</h1>
        <p style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>City-wide camera infrastructure & vehicle re-identification system</p>
      </div>

      <ReIDExplainer />

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 16, marginBottom: 16 }}>
        <CameraTopology />
        <CameraTable />
      </div>
    </div>
  );
}
