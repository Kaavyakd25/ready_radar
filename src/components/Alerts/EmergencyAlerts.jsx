import React from 'react';
import { useRover } from '../../context/RoverContext';
import {
  BellRing,
  AlertTriangle,
  AlertOctagon,
  Info,
  X,
  Trash2
} from 'lucide-react';

export const EmergencyAlerts = () => {
  const { alerts, dismissAlert, clearAlerts } = useRover();

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-title">
          <BellRing size={18} />
          <span>Emergency Alerts Feed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="card-badge" style={{ color: alerts.some(a => a.level === 'critical') ? 'var(--text-rose)' : 'var(--text-cyan)' }}>
            {alerts.length} ALERTS
          </div>
          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="card-badge"
              style={{
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Clear all alerts"
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <Info size={28} style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }} />
            <div>No active priority alerts. Operations nominal.</div>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCrit = alert.level === 'critical';
            const isWarn = alert.level === 'warning';
            return (
              <div key={alert.id} className={`alert-item ${alert.level}`}>
                <div className={`alert-icon ${alert.level}`}>
                  {isCrit ? <AlertOctagon size={18} /> : isWarn ? <AlertTriangle size={18} /> : <Info size={18} />}
                </div>

                <div className="alert-body">
                  <div className="alert-top">
                    <span className="alert-name">{alert.title}</span>
                    <span className="alert-time">{alert.timestamp}</span>
                  </div>
                  <div className="alert-desc">{alert.message}</div>
                </div>

                <button
                  className="alert-dismiss"
                  onClick={() => dismissAlert(alert.id)}
                  title="Dismiss alert"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
