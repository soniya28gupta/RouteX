import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { api } from '../services/api';
import { TRAFFIC_VOLUME, VEHICLE_TYPES, CONGESTION_DATA, FLOW_DATA } from '../data/seedData';

const CONG_COLORS: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const PIE_COLORS = ['#00d4ff', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
      <div style={{ color: '#4b6280', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}{p.dataKey === 'speed' ? ' km/h' : ''}
        </div>
      ))}
    </div>
  );
};

export default function TrafficAnalytics() {
  const [period, setPeriod] = useState<'today' | 'morning' | 'afternoon' | 'evening'>('today');
  const [congestionFilter, setCongestionFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredVolume = period === 'morning'
    ? TRAFFIC_VOLUME.filter(d => parseInt(d.hour) < 12)
    : period === 'afternoon'
    ? TRAFFIC_VOLUME.filter(d => parseInt(d.hour) >= 12 && parseInt(d.hour) < 17)
    : period === 'evening'
    ? TRAFFIC_VOLUME.filter(d => parseInt(d.hour) >= 17)
    : TRAFFIC_VOLUME;

  const filteredCongestion = congestionFilter === 'all'
    ? CONGESTION_DATA
    : CONGESTION_DATA.filter(d => d.level === congestionFilter);

  return (
    <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Urban Traffic Analytics</h1>
          <p style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>City-wide traffic intelligence · Bhopal</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['today', 'morning', 'afternoon', 'evening'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ padding: '5px 12px', fontSize: 11, fontWeight: period === p ? 600 : 400, cursor: 'pointer', borderRadius: 6, border: `1px solid ${period === p ? 'rgba(0,212,255,0.4)' : '#1e2d42'}`, background: period === p ? 'rgba(0,212,255,0.1)' : '#080c14', color: period === p ? '#00d4ff' : '#4b6280', textTransform: 'capitalize' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Volume + Types */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 16 }}>
        <Panel>
          <SectionHeader title="Traffic Volume" sub={`Vehicles per hour · ${period}`} />
          <div style={{ display: 'flex', gap: 20, marginBottom: 12, fontSize: 11 }}>
            <div style={{ padding: '3px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, color: '#ef4444' }}>
              ⚡ Peak: 08:00–10:00 (583 vehicles)
            </div>
            <div style={{ padding: '3px 8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, color: '#f59e0b' }}>
              ⚡ Evening: 17:00–19:00 (612 vehicles)
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={filteredVolume}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="vehicles" name="Vehicles" stroke="#00d4ff" fill="url(#vg)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <SectionHeader title="Vehicle Type Distribution" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={VEHICLE_TYPES} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                {VEHICLE_TYPES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1421', border: '1px solid #1e2d42', borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {VEHICLE_TYPES.map((t, i) => (
              <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i] }} />
                <span style={{ color: '#4b6280' }}>{t.type}</span>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>{t.percentage}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Row 2: Speed + Congestion */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Panel>
          <SectionHeader title="Average Speed Trend" sub="km/h by hour" />
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={filteredVolume}>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4b6280' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="speed" name="Speed" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <SectionHeader title="Road Congestion Status" />
            <div style={{ display: 'flex', gap: 4 }}>
              {(['all', 'high', 'medium', 'low'] as const).map(f => (
                <button key={f} onClick={() => setCongestionFilter(f)}
                  style={{ padding: '3px 7px', fontSize: 10, cursor: 'pointer', borderRadius: 4, border: `1px solid ${congestionFilter === f ? CONG_COLORS[f] ?? '#1e2d42' : '#1e2d42'}`, background: congestionFilter === f ? `${CONG_COLORS[f] ?? '#1e2d42'}18` : 'transparent', color: congestionFilter === f ? CONG_COLORS[f] ?? '#f1f5f9' : '#4b6280', textTransform: 'capitalize' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 160 }}>
            {filteredCongestion.map(c => (
              <div key={c.camera} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 10, color: '#4b6280', width: 55, flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>{c.camera}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', width: 120, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.road}</div>
                <div style={{ flex: 1, height: 6, background: '#1e2d42', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${c.score}%`, height: '100%', background: CONG_COLORS[c.level], borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 10, color: CONG_COLORS[c.level], fontWeight: 600, width: 28, textAlign: 'right' }}>{c.score}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Row 3: Vehicle Flow */}
      <Panel>
        <SectionHeader title="Vehicle Flow — Camera Pairs" sub="Inter-camera movement counts" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {FLOW_DATA.map(f => (
            <div key={`${f.from}-${f.to}`} style={{ background: '#111827', border: '1px solid #1e2d42', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 3, padding: '1px 5px' }}>{f.from}</span>
                <span style={{ fontSize: 10, color: '#2a3f5c' }}>→</span>
                <span style={{ fontSize: 10, color: '#3b82f6', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 3, padding: '1px 5px' }}>{f.to}</span>
              </div>
              <div style={{ fontSize: 10, color: '#4b6280', marginBottom: 4 }}>{f.from_name} → {f.to_name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{f.count.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: '#2a3f5c' }}>vehicles today</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
