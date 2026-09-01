import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Camera, Car, ExternalLink, X, CheckCircle } from 'lucide-react';
import { ALERTS } from '../data/seedData';
import { useSimStore } from '../store/simulationStore';
import type { Alert } from '../types';

const SEV_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', icon: AlertTriangle, label: 'Critical' },
  warning:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', icon: AlertCircle,  label: 'Warning'  },
  info:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', icon: Info,          label: 'Info'     },
};

function AlertCard({ alert, onDismiss }: { alert: Alert; onDismiss?: () => void }) {
  const cfg = SEV_CONFIG[alert.severity] ?? SEV_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <div
      className={alert.severity === 'critical' ? 'alert-flash' : ''}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <Icon size={15} color={cfg.color} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, borderRadius: 3, padding: '1px 6px' }}>
                {cfg.label}
              </span>
              {alert.camera_id && (
                <span style={{ fontSize: 9.5, color: '#4b6280', background: '#111827', border: '1px solid #1e2d42', borderRadius: 3, padding: '1px 6px', fontFamily: 'JetBrains Mono, monospace' }}>
                  {alert.camera_id}
                </span>
              )}
              {alert.vehicle_id && (
                <span style={{ fontSize: 9.5, color: '#94a3b8', background: '#111827', border: '1px solid #1e2d42', borderRadius: 3, padding: '1px 6px' }}>
                  {alert.vehicle_id}
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{alert.title}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
            <span style={{ fontSize: 10, color: '#4b6280', fontFamily: 'JetBrains Mono, monospace' }}>{alert.timestamp}</span>
            {onDismiss && (
              <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a3f5c', padding: 2 }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#4b6280', lineHeight: 1.5 }}>{alert.description}</div>

        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          <button style={{ fontSize: 10, padding: '4px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e2d42', borderRadius: 5, color: '#94a3b8', cursor: 'pointer' }}>
            View Details
          </button>
          {alert.vehicle_id && (
            <button style={{ fontSize: 10, padding: '4px 10px', background: `${cfg.color}12`, border: `1px solid ${cfg.color}30`, borderRadius: 5, color: cfg.color, cursor: 'pointer' }}>
              Track Vehicle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Alerts() {
  const { newAlerts } = useSimStore();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const combined: Alert[] = [
    ...newAlerts.filter(a => !ALERTS.find(s => s.alert_id === a.alert_id)),
    ...ALERTS,
  ].filter(a => !dismissed.has(a.alert_id));

  const filtered = filter === 'all' ? combined : combined.filter(a => a.severity === filter);

  const counts = {
    critical: combined.filter(a => a.severity === 'critical').length,
    warning: combined.filter(a => a.severity === 'warning').length,
    info: combined.filter(a => a.severity === 'info').length,
  };

  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Alerts & Anomaly Detection</h1>
          <p style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>AI-generated traffic alerts and anomalies</p>
        </div>

        {/* Summary badges */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'critical', label: 'Critical', count: counts.critical, color: '#ef4444' },
            { key: 'warning',  label: 'Warning',  count: counts.warning,  color: '#f59e0b' },
            { key: 'info',     label: 'Info',     count: counts.info,     color: '#3b82f6' },
          ].map(({ key, label, count, color }) => (
            <div key={key} style={{ padding: '4px 12px', background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 6, fontSize: 11, fontWeight: 600, color }}>
              {count} {label}
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['all', 'critical', 'warning', 'info'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px', fontSize: 11, fontWeight: filter === f ? 600 : 400,
              cursor: 'pointer', borderRadius: 6, textTransform: 'capitalize',
              border: `1px solid ${filter === f ? SEV_CONFIG[f as keyof typeof SEV_CONFIG]?.color ?? '#00d4ff' : '#1e2d42'}`,
              background: filter === f ? `${SEV_CONFIG[f as keyof typeof SEV_CONFIG]?.color ?? '#00d4ff'}12` : '#080c14',
              color: filter === f ? SEV_CONFIG[f as keyof typeof SEV_CONFIG]?.color ?? '#00d4ff' : '#4b6280',
            }}>
            {f === 'all' ? `All (${combined.length})` : f}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#2a3f5c' }}>
            <CheckCircle size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div>No alerts in this category</div>
          </div>
        ) : (
          filtered.map(a => (
            <AlertCard key={a.alert_id} alert={a} onDismiss={() => setDismissed(prev => new Set([...prev, a.alert_id]))} />
          ))
        )}
      </div>
    </div>
  );
}
