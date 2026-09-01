import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CAMERAS, DEMO_DETECTIONS } from '../data/seedData';
import { useSimStore } from '../store/simulationStore';
import { Navigation, Layers, Clock, MapPin } from 'lucide-react';

// Fix Leaflet default icon issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' });

const DEMO_JOURNEY_CAMS = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-005'];

const JOURNEY_COORDS = DEMO_JOURNEY_CAMS.map(id => {
  const cam = CAMERAS.find(c => c.camera_id === id)!;
  return [cam.latitude, cam.longitude] as [number, number];
});

type Filter = 'all' | 'trajectory' | 'congested' | 'network';

function MapFitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords as any, { padding: [40, 40] });
    }
  }, [coords]);
  return null;
}

export default function TrajectoryExplorer() {
  const { visitedCameras, isRunning } = useSimStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedCam, setSelectedCam] = useState<string | null>(null);
  const [animatedSegments, setAnimatedSegments] = useState<number>(0);

  // Animate trajectory segments as simulation runs
  useEffect(() => {
    if (visitedCameras.length > 0) {
      setAnimatedSegments(visitedCameras.length - 1);
    }
  }, [visitedCameras]);

  // Full demo journey always shown after simulation
  const showFullRoute = visitedCameras.length === 4;

  const routeCoords = showFullRoute
    ? JOURNEY_COORDS
    : JOURNEY_COORDS.slice(0, animatedSegments + 1);

  const center: [number, number] = [23.248, 77.403];

  const congCams = CAMERAS.filter(c => c.congestion_level === 'high');

  function camColor(cam: (typeof CAMERAS)[0]) {
    if (DEMO_JOURNEY_CAMS.includes(cam.camera_id)) {
      const idx = visitedCameras.indexOf(cam.camera_id);
      return idx >= 0 ? '#10b981' : '#3b82f6';
    }
    if (cam.congestion_level === 'high') return '#ef4444';
    if (cam.congestion_level === 'medium') return '#f59e0b';
    return '#4b6280';
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Left controls */}
      <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid #1e2d42', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #1e2d42' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 12 }}>Trajectory Explorer</div>

          <div style={{ fontSize: 10, color: '#2a3f5c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Map Filters</div>
          {(['all', 'trajectory', 'congested', 'network'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                display: 'block', width: '100%', padding: '7px 10px', marginBottom: 4,
                background: filter === f ? 'rgba(0,212,255,0.1)' : 'transparent',
                border: `1px solid ${filter === f ? 'rgba(0,212,255,0.3)' : '#1e2d42'}`,
                borderRadius: 6, color: filter === f ? '#00d4ff' : '#4b6280',
                fontSize: 11, fontWeight: filter === f ? 600 : 400,
                cursor: 'pointer', textAlign: 'left', textTransform: 'capitalize',
              }}>
              {f === 'all' ? 'All Cameras' : f === 'trajectory' ? 'Demo Vehicle Route' : f === 'congested' ? 'Congested Roads' : 'Camera Network'}
            </button>
          ))}
        </div>

        {/* Demo vehicle panel */}
        <div style={{ padding: 16, borderBottom: '1px solid #1e2d42' }}>
          <div style={{ fontSize: 10, color: '#2a3f5c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Demo Vehicle Route</div>
          <div style={{ padding: '8px 10px', background: '#111827', border: '1px solid #1e2d42', borderRadius: 7, marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace' }}>MP04AB1234</div>
            <div style={{ fontSize: 10, color: '#4b6280', marginTop: 2 }}>White Sedan · V-1042</div>
          </div>

          {DEMO_DETECTIONS.map((det, i) => {
            const visited = visitedCameras.includes(det.camera_id) || showFullRoute;
            return (
              <div key={det.detection_id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, opacity: visited ? 1 : 0.35 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: visited ? '#10b981' : '#2a3f5c', flexShrink: 0, marginTop: 3, boxShadow: visited ? '0 0 6px #10b981' : 'none' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9' }}>{det.camera_id} · {det.timestamp}</div>
                  <div style={{ fontSize: 10, color: '#4b6280' }}>{det.camera_name}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: '#2a3f5c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Legend</div>
          {[
            { color: '#10b981', label: 'Demo route camera' },
            { color: '#ef4444', label: 'High congestion' },
            { color: '#f59e0b', label: 'Medium congestion' },
            { color: '#4b6280', label: 'Monitoring camera' },
            { color: '#00d4ff', label: 'Active trajectory' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 11, color: '#4b6280' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />

          {/* All cameras */}
          {CAMERAS.filter(c => filter === 'all' || filter === 'network' || (filter === 'trajectory' && DEMO_JOURNEY_CAMS.includes(c.camera_id)) || (filter === 'congested' && c.congestion_level === 'high')).map(cam => (
            <CircleMarker
              key={cam.camera_id}
              center={[cam.latitude, cam.longitude]}
              radius={DEMO_JOURNEY_CAMS.includes(cam.camera_id) ? 10 : 6}
              pathOptions={{
                color: camColor(cam),
                fillColor: camColor(cam),
                fillOpacity: 0.8,
                weight: DEMO_JOURNEY_CAMS.includes(cam.camera_id) ? 2 : 1,
              }}
              eventHandlers={{ click: () => setSelectedCam(selectedCam === cam.camera_id ? null : cam.camera_id) }}
            >
              <Popup>
                <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
                  <strong style={{ color: '#1e40af' }}>{cam.camera_id}</strong><br />
                  {cam.name}<br />
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{cam.location}</span><br />
                  <span style={{ fontSize: 10 }}>
                    Vehicles: {cam.vehicle_count} · {cam.fps} FPS · <span style={{ color: cam.congestion_level === 'high' ? '#ef4444' : cam.congestion_level === 'medium' ? '#f59e0b' : '#10b981', textTransform: 'capitalize' }}>{cam.congestion_level}</span>
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Trajectory route */}
          {(filter === 'all' || filter === 'trajectory') && routeCoords.length > 1 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: '#00d4ff', weight: 3, opacity: 0.9, dashArray: showFullRoute ? undefined : '8 4' }}
            />
          )}

          {/* Camera labels for demo cams */}
          {(filter === 'all' || filter === 'trajectory') && DEMO_DETECTIONS.map((det, i) => {
            const cam = CAMERAS.find(c => c.camera_id === det.camera_id)!;
            return (
              <Marker
                key={`label-${det.camera_id}`}
                position={[cam.latitude + 0.003, cam.longitude]}
                icon={L.divIcon({
                  html: `<div style="background:#0d1421;border:1px solid #1e2d42;border-radius:4px;padding:2px 6px;font-size:9px;color:#00d4ff;font-family:monospace;white-space:nowrap;">${det.camera_id} · ${det.timestamp}</div>`,
                  className: '',
                  iconAnchor: [0, 0],
                })}
              />
            );
          })}

          <MapFitBounds coords={CAMERAS.map(c => [c.latitude, c.longitude])} />
        </MapContainer>

        {/* Overlay: active journey */}
        {(showFullRoute || visitedCameras.length > 0) && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(8,12,20,0.92)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: 10, padding: '12px 14px',
            backdropFilter: 'blur(8px)',
            zIndex: 500, minWidth: 200,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#00d4ff', marginBottom: 8 }}>Active Trajectory</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>MP04AB1234</div>
            <div style={{ fontSize: 10, color: '#4b6280', marginBottom: 8 }}>CAM-001 → CAM-002 → CAM-003 → CAM-005</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
              <div><span style={{ color: '#4b6280' }}>Distance: </span><span style={{ color: '#94a3b8' }}>12.4 km</span></div>
              <div><span style={{ color: '#4b6280' }}>Duration: </span><span style={{ color: '#94a3b8' }}>22m 37s</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
