import React, { useState } from 'react';
import { Search, Filter, Camera, Car, CheckCircle, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { DEMO_DETECTIONS, VEHICLES, CAMERAS } from '../data/seedData';
import type { Detection } from '../types';

const ALL_DETECTIONS: Detection[] = [
  ...DEMO_DETECTIONS,
  { detection_id: 'DET-002-001', vehicle_id: 'V-0891', camera_id: 'CAM-002', camera_name: 'Board Office Square', camera_location: 'Board Office, Bhopal', timestamp: '10:09:32', plate: 'MP04XY7788', plate_confidence: 95.1, vehicle_confidence: 94.3, vehicle_type: 'SUV', color: 'Black' },
  { detection_id: 'DET-002-002', vehicle_id: 'V-0891', camera_id: 'CAM-006', camera_name: 'BHEL Square', camera_location: 'BHEL, Bhopal', timestamp: '10:14:11', plate: 'MP04XY7788', plate_confidence: 93.8, vehicle_confidence: 92.1, vehicle_type: 'SUV', color: 'Black' },
  { detection_id: 'DET-003-001', vehicle_id: 'V-0234', camera_id: 'CAM-001', camera_name: 'MP Nagar Junction', camera_location: 'MP Nagar, Bhopal', timestamp: '09:41:22', plate: 'MP09CD5566', plate_confidence: 93.8, vehicle_confidence: 91.2, vehicle_type: 'Hatchback', color: 'Silver' },
  { detection_id: 'DET-004-001', vehicle_id: 'V-0567', camera_id: 'CAM-004', camera_name: 'Lalghati', camera_location: 'Lalghati, Bhopal', timestamp: '08:15:00', plate: 'MP04GH3311', plate_confidence: 98.3, vehicle_confidence: 97.8, vehicle_type: 'Bus', color: 'Red' },
  { detection_id: 'DET-005-001', vehicle_id: 'V-0789', camera_id: 'CAM-003', camera_name: 'Habibganj Junction', camera_location: 'Habibganj, Bhopal', timestamp: '10:21:44', plate: 'MP04RS2244', plate_confidence: 62.4, vehicle_confidence: 88.1, vehicle_type: 'Bike', color: 'Black' },
];

const CAMERAS_LIST = CAMERAS.slice(0, 8);

export default function ANPRSearch({ onNav }: { onNav: (p: any) => void }) {
  const [query, setQuery] = useState('');
  const [filterCam, setFilterCam] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selected, setSelected] = useState<Detection | null>(null);

  const filtered = ALL_DETECTIONS.filter(d => {
    const q = query.toUpperCase().trim();
    const matchQ = !q || d.plate.toUpperCase().includes(q) || d.vehicle_id.toUpperCase().includes(q);
    const matchCam = !filterCam || d.camera_id === filterCam;
    const matchType = !filterType || d.vehicle_type === filterType;
    return matchQ && matchCam && matchType;
  });

  function confidenceColor(v: number) {
    return v >= 90 ? '#10b981' : v >= 75 ? '#f59e0b' : '#ef4444';
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Main table area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: selected ? '1px solid #1e2d42' : 'none' }}>
        {/* Search bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2d42', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4b6280' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search license plate, vehicle ID…"
              style={{ width: '100%', padding: '8px 10px 8px 30px', background: '#080c14', border: '1px solid #1e2d42', borderRadius: 7, color: '#f1f5f9', fontSize: 12, outline: 'none', boxSizing: 'border-box', fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          {/* Camera filter */}
          <div style={{ position: 'relative' }}>
            <select
              value={filterCam}
              onChange={e => setFilterCam(e.target.value)}
              style={{ padding: '8px 28px 8px 10px', background: '#080c14', border: '1px solid #1e2d42', borderRadius: 7, color: filterCam ? '#f1f5f9' : '#4b6280', fontSize: 11, outline: 'none', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">All Cameras</option>
              {CAMERAS_LIST.map(c => <option key={c.camera_id} value={c.camera_id}>{c.camera_id} — {c.name}</option>)}
            </select>
            <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#4b6280', pointerEvents: 'none' }} />
          </div>

          {/* Type filter */}
          <div style={{ position: 'relative' }}>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{ padding: '8px 28px 8px 10px', background: '#080c14', border: '1px solid #1e2d42', borderRadius: 7, color: filterType ? '#f1f5f9' : '#4b6280', fontSize: 11, outline: 'none', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">All Types</option>
              {['Sedan', 'SUV', 'Hatchback', 'Bus', 'Truck', 'Bike'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#4b6280', pointerEvents: 'none' }} />
          </div>

          <div style={{ fontSize: 11, color: '#4b6280', padding: '6px 10px', background: '#080c14', border: '1px solid #1e2d42', borderRadius: 6, whiteSpace: 'nowrap' }}>
            {filtered.length} results
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e2d42', position: 'sticky', top: 0, background: '#0a1120' }}>
                {['Time', 'Camera', 'License Plate', 'Vehicle', 'Plate Conf.', 'Vehicle Conf.', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#2a3f5c', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(det => {
                const isSelected = selected?.detection_id === det.detection_id;
                const lowConf = det.plate_confidence < 75;
                return (
                  <tr
                    key={det.detection_id}
                    onClick={() => setSelected(isSelected ? null : det)}
                    style={{
                      borderBottom: '1px solid #111827',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(0,212,255,0.06)' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#111827'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{det.timestamp}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 10, color: '#00d4ff', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, padding: '2px 6px', fontFamily: 'JetBrains Mono, monospace' }}>{det.camera_id}</span>
                      <div style={{ fontSize: 10, color: '#4b6280', marginTop: 2 }}>{det.camera_name}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>{det.plate}</span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{det.vehicle_type}</div>
                      <div style={{ fontSize: 10, color: '#4b6280' }}>{det.color}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: confidenceColor(det.plate_confidence), fontFamily: 'JetBrains Mono, monospace' }}>
                        {det.plate_confidence.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: confidenceColor(det.vehicle_confidence), fontFamily: 'JetBrains Mono, monospace' }}>
                        {det.vehicle_confidence.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {lowConf ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#f59e0b' }}>
                          <AlertCircle size={11} /> Low Conf.
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#10b981' }}>
                          <CheckCircle size={11} /> Matched
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#2a3f5c' }}>
              <Search size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
              <div>No ANPR records match your search</div>
            </div>
          )}
        </div>
      </div>

      {/* Side detail panel */}
      {selected && (
        <div style={{ width: 300, flexShrink: 0, overflowY: 'auto', padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>Detection Detail</div>

          {/* Simulated snapshot */}
          <div style={{ background: '#080c14', border: '1px solid #1e2d42', borderRadius: 8, height: 120, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Camera size={24} color="#2a3f5c" />
            <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 9, color: '#2a3f5c', fontFamily: 'JetBrains Mono, monospace' }}>
              {selected.camera_id} · {selected.timestamp}
            </div>
            <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, color: '#2a3f5c' }}>SNAPSHOT</div>
          </div>

          {[
            ['Detection ID', selected.detection_id],
            ['License Plate', selected.plate],
            ['Camera', `${selected.camera_id} — ${selected.camera_name}`],
            ['Location', selected.camera_location],
            ['Timestamp', selected.timestamp],
            ['Vehicle Type', selected.vehicle_type ?? '—'],
            ['Color', selected.color ?? '—'],
            ['Plate Confidence', `${selected.plate_confidence.toFixed(1)}%`],
            ['Vehicle Confidence', `${selected.vehicle_confidence.toFixed(1)}%`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #111827' }}>
              <span style={{ fontSize: 11, color: '#4b6280' }}>{label}</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textAlign: 'right', maxWidth: 160, fontFamily: (label?.includes('ID') || label?.includes('Plate') || (label?.includes('Camera') && label.length < 10)) ? 'JetBrains Mono, monospace' : 'inherit' }}>{value}</span>
            </div>
          ))}

          <button
            onClick={() => onNav('tracking')}
            style={{ marginTop: 14, width: '100%', padding: '8px 0', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 7, color: '#00d4ff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            View Full Vehicle History →
          </button>
        </div>
      )}
    </div>
  );
}
