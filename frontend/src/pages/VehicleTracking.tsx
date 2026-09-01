import React, { useState, useEffect } from 'react';
import { Search, Car, MapPin, Clock, Camera, CheckCircle, ChevronRight, Activity } from 'lucide-react';
import { api } from '../services/api';
import { DEMO_DETECTIONS, VEHICLES, CAMERAS } from '../data/seedData';
import type { Vehicle, Detection } from '../types';
import { useSimStore } from '../store/simulationStore';

function ConfBar({ value, color = '#00d4ff' }: { value: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: '#1e2d42', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', minWidth: 38 }}>{value.toFixed(1)}%</span>
    </div>
  );
}

function TimelineEvent({ det, index, total }: { det: Detection; index: number; total: number }) {
  const cam = CAMERAS.find(c => c.camera_id === det.camera_id);
  return (
    <div style={{ display: 'flex', gap: 14 }} className="fade-up">
      {/* Left: connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 20 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: index === 0 ? '#00d4ff' : '#3b82f6', border: `2px solid ${index === 0 ? '#00d4ff' : '#3b82f6'}`, boxShadow: `0 0 8px ${index === 0 ? '#00d4ff' : '#3b82f6'}` }} />
        {index < total - 1 && <div className="timeline-line" style={{ flex: 1, width: 2, minHeight: 40, marginTop: 4 }} />}
      </div>
      {/* Right: content */}
      <div style={{ flex: 1, paddingBottom: index < total - 1 ? 20 : 0 }}>
        <div style={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: 10, padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#00d4ff', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, padding: '2px 6px' }}>{det.camera_id}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{cam?.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#4b6280' }}>
                <MapPin size={10} />
                {cam?.location}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace' }}>{det.timestamp}</div>
              <div style={{ fontSize: 10, color: '#4b6280', marginTop: 2 }}>Detection {index + 1} of {total}</div>
            </div>
          </div>

          {/* Plate */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '8px 12px', background: '#080c14', borderRadius: 7, border: '1px solid #1e2d42' }}>
            <span style={{ fontSize: 11, color: '#4b6280' }}>Plate:</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>{det.plate}</span>
            <CheckCircle size={14} color="#10b981" style={{ marginLeft: 'auto' }} />
          </div>

          {/* Confidence bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: '#4b6280', marginBottom: 4 }}>Plate Confidence</div>
              <ConfBar value={det.plate_confidence} color="#00d4ff" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#4b6280', marginBottom: 4 }}>Vehicle Confidence</div>
              <ConfBar value={det.vehicle_confidence} color="#3b82f6" />
            </div>
          </div>
        </div>

        {index < total - 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, marginLeft: 12, fontSize: 10, color: '#2a3f5c' }}>
            <ChevronRight size={10} />
            <span>Travelling to next camera…</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VehicleTracking({ onNav }: { onNav: (p: any) => void }) {
  const [query, setQuery] = useState('');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { visitedCameras } = useSimStore();

  // Auto-load demo vehicle when simulation completes trajectory
  useEffect(() => {
    if (visitedCameras.length === 4 && !vehicle) {
      handleSearch('MP04AB1234');
    }
  }, [visitedCameras]);

  async function handleSearch(q?: string) {
    const searchQ = (q ?? query).trim();
    if (!searchQ) return;
    setLoading(true);
    setNotFound(false);
    const v = await api.searchVehicle(searchQ);
    if (!v) {
      setNotFound(true);
      setLoading(false);
      setVehicle(null);
      setDetections([]);
      return;
    }
    setVehicle(v);
    const dets = await api.getVehicleDetections(v.vehicle_id);
    setDetections(dets.length > 0 ? dets : DEMO_DETECTIONS.filter(d => d.vehicle_id === v.vehicle_id));
    setLoading(false);
  }

  function durationStr(secs: number) {
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${m}m ${s}s`;
  }

  return (
    <div style={{ display: 'flex', height: '100%', gap: 0 }}>
      {/* Left panel: search + vehicle profile */}
      <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid #1e2d42', display: 'flex', flexDirection: 'column' }}>
        {/* Search */}
        <div style={{ padding: 16, borderBottom: '1px solid #1e2d42' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 10 }}>Vehicle Intelligence</div>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4b6280' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search plate or Vehicle ID…"
              style={{
                width: '100%', padding: '8px 10px 8px 30px',
                background: '#080c14', border: '1px solid #1e2d42',
                borderRadius: 7, color: '#f1f5f9', fontSize: 12,
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />
          </div>
          <button
            onClick={() => handleSearch()}
            style={{ marginTop: 8, width: '100%', padding: '7px 0', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 7, color: '#00d4ff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            {loading ? 'Searching…' : 'Search Vehicle'}
          </button>

          {/* Quick search buttons */}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10, color: '#2a3f5c', marginBottom: 6 }}>Quick Search:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {VEHICLES.slice(0, 4).map(v => (
                <button key={v.vehicle_id} onClick={() => { setQuery(v.license_plate); handleSearch(v.license_plate); }}
                  style={{ fontSize: 9.5, padding: '3px 7px', background: '#111827', border: '1px solid #1e2d42', borderRadius: 4, color: '#4b6280', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>
                  {v.license_plate}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle profile */}
        {notFound && (
          <div style={{ padding: 20, textAlign: 'center', color: '#4b6280', fontSize: 12 }}>
            No vehicle found for "{query}"
          </div>
        )}

        {vehicle && (
          <div style={{ overflowY: 'auto', flex: 1, padding: 16 }}>
            {/* Profile card */}
            <div style={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={20} color="#00d4ff" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>{vehicle.license_plate}</div>
                  <div style={{ fontSize: 11, color: '#4b6280' }}>{vehicle.vehicle_id}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Type', value: vehicle.vehicle_type },
                  { label: 'Color', value: vehicle.color },
                  { label: 'First Seen', value: vehicle.first_seen },
                  { label: 'Last Seen', value: vehicle.last_seen },
                  { label: 'Cameras', value: `${vehicle.cameras_visited} visited` },
                  { label: 'Confidence', value: `${vehicle.confidence}%` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 9.5, color: '#2a3f5c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 7 }}>
                <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginBottom: 2 }}>Journey Duration</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>22m 37s</div>
              </div>
            </div>

            {/* View trajectory button */}
            <button
              onClick={() => onNav('trajectory')}
              style={{ width: '100%', padding: '8px 0', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 7, color: '#3b82f6', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}
            >
              View Trajectory on Map →
            </button>

            {/* Camera history */}
            <div style={{ fontSize: 11, color: '#4b6280', marginBottom: 8 }}>
              <Activity size={11} style={{ display: 'inline', marginRight: 4 }} />
              {detections.length} Camera Detections
            </div>
          </div>
        )}

        {!vehicle && !notFound && !loading && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, color: '#2a3f5c', textAlign: 'center' }}>
            <Search size={32} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 12, marginBottom: 6 }}>Search any license plate</div>
            <div style={{ fontSize: 10 }}>Try: MP04AB1234</div>
          </div>
        )}
      </div>

      {/* Right panel: timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {vehicle && detections.length > 0 ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 6 }}>
              Journey Timeline — {vehicle.license_plate}
            </div>
            <div style={{ fontSize: 11, color: '#4b6280', marginBottom: 20 }}>
              {vehicle.first_seen} → {vehicle.last_seen} · {detections.length} cameras · {vehicle.cameras_visited} unique locations
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {detections.map((det, i) => (
                <TimelineEvent key={det.detection_id} det={det} index={i} total={detections.length} />
              ))}
            </div>

            {/* Match summary */}
            <div className="match-banner" style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>✓ Cross-Camera Re-Identification Complete</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Plate Match', value: '98.1%', icon: '🔤' },
                  { label: 'Visual Match', value: '96.4%', icon: '👁' },
                  { label: 'Route Valid', value: '✓', icon: '🗺' },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
                    <div style={{ fontSize: 10, color: '#4b6280' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2a3f5c', textAlign: 'center' }}>
            <div>
              <Car size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <div style={{ fontSize: 13 }}>Search a vehicle to view journey timeline</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>Multi-camera trajectory tracking enabled</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
