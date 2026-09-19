import React, { useState } from 'react';
import { useRover } from '../../context/RoverContext';
import {
  History,
  Terminal,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export const ActivityLog = () => {
  const { logs } = useRover();
  const [filterTag, setFilterTag] = useState('ALL');

  const filteredLogs = filterTag === 'ALL'
    ? logs
    : logs.filter(l => l.tag === filterTag || l.type === filterTag.toLowerCase());

  const getLogAccentColor = (type) => {
    switch (type) {
      case 'critical':
        return 'var(--text-rose)';
      case 'warning':
        return 'var(--text-amber)';
      case 'success':
        return 'var(--text-emerald)';
      default:
        return 'var(--accent-cyan)';
    }
  };

  return (
    <div className="dashboard-card activity-log-card">
      <div className="card-header">
        <div className="card-title">
          <Terminal size={18} />
          <span>Mission Activity Stream</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['ALL', 'NAV', 'HAZARD', 'E-STOP'].map(t => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className="card-badge"
              style={{
                cursor: 'pointer',
                background: filterTag === t ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
                color: filterTag === t ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="log-timeline">
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            No log entries match the current filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const accent = getLogAccentColor(log.type);
            return (
              <div
                key={log.id}
                className="log-item"
                style={{ '--log-accent': accent }}
              >
                <span className="log-time">{log.timestamp}</span>
                <span className="log-tag">{log.tag}</span>
                <span className="log-msg">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
