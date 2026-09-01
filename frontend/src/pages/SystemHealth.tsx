import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Cpu, Database, Shield, Lock, FileText } from 'lucide-react';
import { useSimStore } from '../store/simulationStore';

// ─────────────────────────────────────────────────────────────────────────────
// AI Pipeline Visual
// ─────────────────────────────────────────────────────────────────────────────
const PIPELINE_STAGES = [
  { id: 'ingest',    label: 'CCTV Stream Ingestion',    tech: 'RTSP / HLS / WebRTC',  time: '< 2ms',  model: 'Video Decoder' },
  { id: 'detect',   label: 'Vehicle Detection',         tech: 'YOLOv8 / YOLOv9',     time: '18ms',   model: 'YOLO-L (80 classes)' },
  { id: 'track',    label: 'Multi-Object Tracking',     tech: 'ByteTrack / DeepSORT', time: '5ms',    model: 'ByteTrack v2' },
  { id: 'plate',    label: 'License Plate Detection',   tech: 'WPOD-Net / YOLOv8',   time: '12ms',   model: 'LP-Detector' },
  { id: 'ocr',      label: 'OCR / ANPR',                tech: 'PaddleOCR / EasyOCR', time: '8ms',    model: 'PP-OCRv4' },
  { id: 'reid',     label: 'Vehicle Re-Identification', tech: 'OSNet / TransReID',    time: '14ms',   model: 'OSNet-AIN' },
  { id: 'match',    label: 'Cross-Camera Matching',     tech: 'Feature Similarity',   time: '3ms',    model: 'Cosine Similarity' },
  { id: 'traj',     label: 'Trajectory Reconstruction', tech: 'Graph + Kalman Filter', time: '2ms',  model: 'Kalman Filter' },
  { id: 'analytics',label: 'Traffic Analytics',         tech: 'Time-Series + Stats',  time: '1ms',   model: 'Custom Analytics' },
  { id: 'dash',     label: 'Decision Dashboard',        tech: 'REST API + WebSocket', time: '< 1ms', model: 'FastAPI + React' },
];

function PipelineVisual({ activeStage }: { activeStage: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 600 }}>
      {PIPELINE_STAGES.map((stage, i) => {
        const isActive = i <= activeStage;
        const isCurrent = i === activeStage;
        return (
          <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div
              className={`pipeline-node ${isActive ? 'active' : ''}`}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 14,
                borderColor: isCurrent ? '#00d4ff' : isActive ? '#3b82f6' : '#1e2d42',
                background: isCurrent ? 'rgba(0,212,255,0.08)' : isActive ? 'rgba(59,130,246,0.05)' : '#111827',
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isCurrent ? '#00d4ff' : isActive ? '#3b82f6' : '#1e2d42' }}>
                {isActive ? <CheckCircle size={12} color="#fff" /> : <Circle size={12} color="#4b6280" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#f1f5f9' : isActive ? '#94a3b8' : '#4b6280' }}>
                    {stage.label}
                  </span>
                  <div style={{ display: 'flex', gap: 8, fontSize: 10 }}>
                    <span style={{ color: '#2a3f5c' }}>{stage.tech}</span>
                    <span style={{ color: isActive ? '#10b981' : '#2a3f5c', fontFamily: 'JetBrains Mono, monospace' }}>{stage.time}</span>
                  </div>
                </div>
                {isCurrent && (
                  <div style={{ fontSize: 10, color: '#4b6280', marginTop: 2 }}>
                    Model: <span style={{ color: '#00d4ff' }}>{stage.model}</span>
                    {' · '}
                    <span className="pulse-live" style={{ display: 'inline', color: '#10b981' }}>● Processing</span>
                  </div>
                )}
              </div>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div style={{ width: 2, height: 8, background: isActive ? 'linear-gradient(#3b82f6,#1e2d42)' : '#1e2d42', marginLeft: 29 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Architecture Diagram
// ─────────────────────────────────────────────────────────────────────────────
function ArchDiagram() {
  const layers = [
    { label: 'CCTV Cameras',        items: ['24 IP Cameras', 'RTSP Streams', '1080p @ 25-30 FPS'],         color: '#4b6280', bg: '#111827' },
    { label: 'Video Ingestion',     items: ['Stream Decoder', 'Frame Buffer', 'Load Balancer'],              color: '#3b82f6', bg: 'rgba(59,130,246,0.06)' },
    { label: 'AI Vision Engine',    items: ['YOLOv8 Detector', 'ByteTrack MOT', 'PaddleOCR ANPR'],          color: '#00d4ff', bg: 'rgba(0,212,255,0.06)' },
    { label: 'Re-ID & Trajectory',  items: ['OSNet Re-ID', 'Cross-Cam Match', 'Kalman Filter Trajectory'],   color: '#8b5cf6', bg: 'rgba(139,92,246,0.06)' },
    { label: 'Analytics Engine',    items: ['Traffic Stats', 'Congestion Detect', 'Anomaly Detection'],      color: '#10b981', bg: 'rgba(16,185,129,0.06)' },
    { label: 'API + Database',      items: ['FastAPI REST', 'WebSocket', 'SQLite / PostgreSQL'],             color: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
    { label: 'CityVision AI UI',    items: ['React Dashboard', 'Leaflet Maps', 'Recharts Analytics'],       color: '#f97316', bg: 'rgba(249,115,22,0.06)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 500 }}>
      {layers.map((layer, i) => (
        <div key={layer.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '100%', background: layer.bg,
            border: `1px solid ${layer.color}30`,
            borderRadius: 8, padding: '10px 16px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: layer.color, marginBottom: 6 }}>{layer.label}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {layer.items.map(item => (
                <span key={item} style={{ fontSize: 10, color: '#4b6280', background: '#080c14', border: '1px solid #1e2d42', borderRadius: 4, padding: '2px 7px' }}>{item}</span>
              ))}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div style={{ width: 2, height: 12, background: `linear-gradient(${layer.color}80, ${layers[i+1].color}80)` }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Privacy Section
// ─────────────────────────────────────────────────────────────────────────────
function PrivacySection() {
  const items = [
    { icon: Shield, title: 'Role-Based Access Control', desc: 'Only authorized operators can view vehicle tracking data. Multi-level permissions enforced.' },
    { icon: FileText, title: 'Audit Logging', desc: 'All queries and vehicle data accesses are logged with operator ID, timestamp, and justification.' },
    { icon: Database, title: 'Data Retention Controls', desc: 'Vehicle trajectory data is retained for configurable periods (default: 30 days). Auto-purge enabled.' },
    { icon: Lock, title: 'Encryption at Rest & Transit', desc: 'All stored data is AES-256 encrypted. API communications use TLS 1.3.' },
    { icon: Shield, title: 'Privacy-Preserving Storage', desc: 'PII is minimized. Only license plates, vehicle type/color, and timestamps are stored — no driver identity.' },
    { icon: Cpu, title: 'On-Premise Processing', desc: 'AI inference runs on-premise. No raw video is transmitted to external services.' },
  ];

  return (
    <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>Privacy & Responsible AI</div>
      <div style={{ fontSize: 11, color: '#4b6280', marginBottom: 16 }}>
        This system is designed with privacy-first principles. Data governance controls are listed below.
        <span style={{ color: '#2a3f5c', display: 'block', marginTop: 4, fontSize: 10 }}>
          Note: This prototype demonstrates intended privacy controls. Legal compliance validation requires certified security audits.
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={13} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 10, color: '#4b6280', lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SystemHealth() {
  const { isRunning, step } = useSimStore();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setActiveStage(s => Math.min(s + 1, PIPELINE_STAGES.length - 1));
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setActiveStage(isRunning ? 0 : PIPELINE_STAGES.length - 1);
    }
  }, [isRunning]);

  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>System Health & Architecture</h1>
        <p style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>AI processing pipeline · System architecture · Privacy controls</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
            AI Processing Pipeline
            <span style={{ fontSize: 10, color: '#4b6280', fontWeight: 400, marginLeft: 10 }}>
              {isRunning ? '⚡ Simulation Active' : 'All stages operational'}
            </span>
          </div>
          <PipelineVisual activeStage={isRunning ? Math.min(step, PIPELINE_STAGES.length - 1) : PIPELINE_STAGES.length - 1} />
        </div>

        <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>System Architecture</div>
          <ArchDiagram />
        </div>
      </div>

      <PrivacySection />
    </div>
  );
}
