import React, { useEffect, useState } from 'react';
import { Camera, Car, Gauge, AlertTriangle, Activity, TrendingUp, TrendingDown, Eye, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import type { TrafficVolume, Alert } from '../types';
import { TRAFFIC_VOLUME, ALERTS } from '../data/seedData';

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  trend?: number;
  color: string;
  glowColor: string;
}

function KPICard({ icon: Icon, label, value, sub, trend, color, glowColor }: KPICardProps) {
  return (
    <div className="kpi-card" style={{ boxShadow: `0 0 20px ${glowColor}18` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 500 }}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }} className="count-in">{value}</div>
        <div style={{ fontSize: 12, color: '#4b6280', marginTop: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: color, marginTop: 4, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  );
}

export default function Overview({ onNav }: { onNav: (p: any) => void }) {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    api.getSummary().then(setSummary);
    api.getAlerts().then(setAlerts);
  }, []);

  const kpiData = summary ?? {
    total_vehicles: 12486, unique_vehicles: 8932, anpr_accuracy: 96.8,
    active_cameras: 24, total_cameras: 24, average_speed: 34.2, congested_roads: 7,
  };

  const recentVolume = TRAFFIC_VOLUME.slice(-8);

  return (
    <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>City-Wide Traffic Intelligence</h1>
        <p style={{ fontSize: 12, color: '#4b6280', marginTop: 4 }}>
          Real-time monitoring · Bhopal City — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <KPICard icon={Car}          label="Total Detections"  value={kpiData.total_vehicles.toLocaleString()} sub="Last 24 hours"      trend={12.4}  color="#00d4ff" glowColor="#00d4ff" />
        <KPICard icon={Eye}          label="Unique Vehicles"   value={kpiData.unique_vehicles.toLocaleString()} sub="Distinct plates"   trend={8.1}   color="#3b82f6" glowColor="#3b82f6" />
        <KPICard icon={Activity}     label="ANPR Accuracy"     value={`${kpiData.anpr_accuracy}%`}              sub="Plate recognition" trend={1.2}   color="#10b981" glowColor="#10b981" />
        <KPICard icon={Camera}       label="Active Cameras"    value={`${kpiData.active_cameras} / ${kpiData.total_cameras}`} sub="1 degraded" trend={undefined} color="#8b5cf6" glowColor="#8b5cf6" />
        <KPICard icon={Gauge}        label="Avg Speed"         value={`${kpiData.average_speed} km/h`}          sub="City-wide avg"    trend={-3.1}  color="#f59e0b" glowColor="#f59e0b" />
        <KPICard icon={AlertTriangle}label="Congested Roads"   value={String(kpiData.congested_roads)}          sub="Above threshold"  trend={4.8}   color="#ef4444" glowColor="#ef4444" />
        <KPICard icon={Zap}          label="Alerts Today"      value="6"                                        sub="2 critical"       trend={undefined} color="#f97316" glowColor="#f97316" />
        <KPICard icon={TrendingUp}   label="Peak Hour"         value="08:00–10:00"                              sub="Morning peak"     trend={undefined} color="#a78bfa" glowColor="#a78bfa" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 20 }}>
        {/* Traffic Volume Chart */}
        <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>Traffic Volume — Today</div>
              <div style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>Vehicles per hour across city</div>
            </div>
            <div style={{ fontSize: 11, color: '#00d4ff', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 5, padding: '3px 8px' }}>
              LIVE
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={recentVolume}>
              <defs>
                <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="vehicles" stroke="#00d4ff" fill="url(#vGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts */}
        <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Recent Alerts
            <button onClick={() => onNav('alerts')} style={{ fontSize: 10, color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.slice(0, 4).map(a => (
              <div key={a.alert_id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '8px 10px',
                borderRadius: 7,
                background: a.severity === 'critical' ? 'rgba(239,68,68,0.06)' : a.severity === 'warning' ? 'rgba(245,158,11,0.06)' : 'rgba(59,130,246,0.06)',
                border: `1px solid ${a.severity === 'critical' ? 'rgba(239,68,68,0.2)' : a.severity === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'}`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: a.severity === 'critical' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#3b82f6' }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9' }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: '#4b6280', marginTop: 2 }}>{a.timestamp} · {a.camera_id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Speed vs Hour */}
      <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Average Speed — Hourly Trend</div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={TRAFFIC_VOLUME}>
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} width={35} unit=" km/h" />
            <Tooltip contentStyle={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${v} km/h`, 'Avg Speed']} />
            <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
