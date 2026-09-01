import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const TOAST_COLORS = {
  success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', color: '#10b981', Icon: CheckCircle },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', color: '#f59e0b', Icon: AlertTriangle },
  error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  color: '#ef4444', Icon: AlertTriangle },
  info:    { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)', color: '#3b82f6', Icon: Info },
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      display: 'flex', flexDirection: 'column', gap: 8,
      zIndex: 9999, maxWidth: 340,
    }}>
      {toasts.map(toast => {
        const cfg = TOAST_COLORS[toast.type];
        const Icon = cfg.Icon;
        return (
          <div key={toast.id} className="toast-in" style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: 10,
            padding: '12px 14px',
            backdropFilter: 'blur(12px)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            <Icon size={14} color={cfg.color} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{toast.title}</div>
              {toast.message && <div style={{ fontSize: 11, color: '#4b6280', marginTop: 2 }}>{toast.message}</div>}
            </div>
            <button onClick={() => onDismiss(toast.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a3f5c', padding: 2 }}>
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

let _addToast: ((t: Omit<Toast, 'id'>) => void) | null = null;

export function useToastController() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }].slice(-5));
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 5000);
  }, []);

  useEffect(() => { _addToast = addToast; return () => { _addToast = null; }; }, [addToast]);

  const dismiss = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  return { toasts, addToast, dismiss };
}

export function toast(t: Omit<Toast, 'id'>) {
  _addToast?.(t);
}
