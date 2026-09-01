import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play, Camera, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useSimStore } from '../store/simulationStore';
import { CAMERAS } from '../data/seedData';
import type { Camera as CameraType } from '../types';

interface Detection {
  plate: string;
  vehicle_id: string;
  plate_confidence: number;
  vehicle_confidence: number;
  event_type: string;
}

const DEMO_CAM_IDS = ['CAM-001', 'CAM-002', 'CAM-003', 'CAM-005'];

function SimulatedFeed({ camera, detection, isActive }: { camera: CameraType; detection?: Detection; isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);
  const detectionRef = useRef(detection);
  detectionRef.current = detection;
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Random "vehicles" — blobs moving across
    const vehicles = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: 40 + Math.random() * (canvas.height - 80),
      vx: (0.3 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1),
      w: 28 + Math.random() * 16,
      h: 14 + Math.random() * 8,
      color: ['#334155', '#1e3a5f', '#1a2e4a', '#243447'][Math.floor(Math.random() * 4)],
      id: i,
    }));

    function draw() {
      if (!canvas) return;
      if (!pausedRef.current) {
        // Background road
        ctx.fillStyle = '#0c1420';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Road markings
        ctx.strokeStyle = '#1e2d42';
        ctx.lineWidth = 1;
        ctx.setLineDash([12, 8]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Grid overlay
        ctx.strokeStyle = '#0d1421';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < canvas.width; i += 30) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }

        // Move + draw vehicles
        vehicles.forEach(v => {
          v.x += v.vx;
          if (v.x > canvas.width + 40) v.x = -40;
          if (v.x < -40) v.x = canvas.width + 40;

          ctx.fillStyle = v.color;
          ctx.beginPath();
          ctx.roundRect(v.x - v.w / 2, v.y - v.h / 2, v.w, v.h, 3);
          ctx.fill();

          // Headlights
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(v.x + (v.vx > 0 ? v.w / 2 : -v.w / 2), v.y - 2, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(v.x + (v.vx > 0 ? v.w / 2 : -v.w / 2), v.y + 2, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Demo vehicle bounding box
        const det = detectionRef.current;
        if (det) {
          const bx = 60, by = canvas.height / 2 - 20, bw = 60, bh = 28;
          // Highlight box
          ctx.strokeStyle = det.event_type === 'cross_camera_match' ? '#10b981' : '#00d4ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx, by, bw, bh);

          // Corner ticks
          const tl = 8;
          ctx.lineWidth = 3;
          [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(([cx, cy], i) => {
            ctx.beginPath();
            ctx.moveTo(cx + (i % 2 === 0 ? tl : -tl), cy);
            ctx.lineTo(cx, cy);
            ctx.lineTo(cx, cy + (i < 2 ? tl : -tl));
            ctx.stroke();
          });

          // Demo vehicle fill
          ctx.fillStyle = 'rgba(0,212,255,0.06)';
          ctx.fillRect(bx, by, bw, bh);

          // Plate label
          ctx.fillStyle = det.event_type === 'cross_camera_match' ? '#10b981' : '#00d4ff';
          ctx.font = 'bold 9px JetBrains Mono, monospace';
          ctx.fillText(det.plate, bx, by - 4);

          // Confidence
          ctx.fillStyle = '#94a3b8';
          ctx.font = '8px Inter, sans-serif';
          ctx.fillText(`${det.plate_confidence.toFixed(1)}%`, bx + bw + 4, by + 10);
        }

        frameRef.current++;
      }
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const cong = camera.congestion_level;
  const congColor = cong === 'high' ? '#ef4444' : cong === 'medium' ? '#f59e0b' : '#10b981';

  return (
    <div className={`camera-panel ${isActive ? 'active' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #1e2d42', background: '#080c14' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse-live" style={{ width: 6, height: 6, borderRadius: '50%', background: camera.status === 'degraded' ? '#f59e0b' : '#10b981' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9', fontFamily: 'JetBrains Mono, monospace' }}>{camera.camera_id}</span>
          <span style={{ fontSize: 10, color: '#4b6280' }}>·</span>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>{camera.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: '#4b6280' }}>{camera.fps} FPS</span>
          <button onClick={() => { setPaused(p => { pausedRef.current = !p; return !p; })} }
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b6280', padding: 2 }}>
            {paused ? <Play size={11} /> : <Pause size={11} />}
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b6280', padding: 2 }}>
            <Maximize2 size={11} />
          </button>
        </div>
      </div>

      {/* Canvas feed */}
      <div style={{ position: 'relative', flex: 1 }}>
        <canvas ref={canvasRef} width={320} height={180} style={{ width: '100%', height: '100%', display: 'block' }} />
        {/* SIMULATED badge */}
        <div style={{ position: 'absolute', top: 6, left: 6, fontSize: 8, color: '#2a3f5c', background: 'rgba(0,0,0,0.7)', border: '1px solid #1e2d42', borderRadius: 3, padding: '2px 5px', letterSpacing: '0.08em' }}>
          SIMULATED FEED
        </div>
        {/* Timestamp */}
        <div style={{ position: 'absolute', bottom: 6, right: 6, fontSize: 9, color: '#4b6280', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.6)', padding: '2px 5px', borderRadius: 3 }}>
          {new Date().toLocaleTimeString('en-IN', { hour12: false })}
        </div>
      </div>

      {/* Footer stats */}
      <div style={{ padding: '6px 10px', borderTop: '1px solid #1e2d42', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ fontSize: 10, color: '#4b6280' }}>Vehicles: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{camera.vehicle_count}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: congColor }} />
            <span style={{ color: congColor, textTransform: 'capitalize' }}>{cong}</span>
          </div>
        </div>
        {/* Detection event */}
        {detection && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
            {detection.event_type === 'cross_camera_match'
              ? <CheckCircle size={10} color="#10b981" />
              : <Zap size={10} color="#00d4ff" />
            }
            <span style={{ color: detection.event_type === 'cross_camera_match' ? '#10b981' : '#00d4ff', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
              {detection.plate}
            </span>
          </div>
        )}
      </div>

      {/* Active detection overlay */}
      {detection && detection.event_type === 'cross_camera_match' && (
        <div style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.08)', borderTop: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>✓ CROSS-CAMERA MATCH</span>
            <span style={{ color: '#10b981' }}>{detection.plate_confidence.toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveCameras() {
  const { activeDetections, demoCameraIndex, isRunning } = useSimStore();

  const displayCams = CAMERAS.slice(0, 6);

  function getDetection(camId: string) {
    return activeDetections.find(d => d.camera_id === camId);
  }

  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Live Camera Grid</h1>
          <p style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>24 cameras · Multi-location ANPR monitoring · Bhopal City</p>
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
          <div style={{ padding: '4px 10px', background: '#080c14', border: '1px solid #1e2d42', borderRadius: 5, color: '#94a3b8' }}>
            All Feeds
          </div>
          <div style={{ padding: '4px 10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 5, color: '#00d4ff' }}>
            {isRunning ? '⚡ AI Active' : '○ Standby'}
          </div>
        </div>
      </div>

      {/* 2×3 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {displayCams.map(cam => (
          <SimulatedFeed
            key={cam.camera_id}
            camera={cam}
            detection={getDetection(cam.camera_id)}
            isActive={isRunning && DEMO_CAM_IDS.includes(cam.camera_id) && !!getDetection(cam.camera_id)}
          />
        ))}
      </div>

      {/* Summary bar */}
      {isRunning && (
        <div className="match-banner fade-up" style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ fontSize: 12 }}>
              <span style={{ color: '#4b6280' }}>Active Detections: </span>
              <span style={{ color: '#00d4ff', fontWeight: 700 }}>{activeDetections.length}</span>
            </div>
            <div style={{ fontSize: 12 }}>
              <span style={{ color: '#4b6280' }}>Demo Vehicle: </span>
              <span style={{ color: '#f1f5f9', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>MP04AB1234</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#10b981' }}>
            <CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} />
            ANPR Pipeline Active
          </div>
        </div>
      )}
    </div>
  );
}
