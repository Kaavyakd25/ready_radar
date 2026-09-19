import React from 'react';

export const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
  subtext,
  barPercent,
  accentColor,
  onClick,
  badgeText
}) => {
  return (
    <div
      className="metric-card"
      style={{ '--card-accent': accentColor }}
      onClick={onClick}
    >
      <div className="metric-icon-box">
        {Icon && <Icon size={24} />}
      </div>
      <div className="metric-content">
        <div className="metric-label">
          <span>{label}</span>
          {badgeText && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '3px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: accentColor || 'var(--text-secondary)'
            }}>
              {badgeText}
            </span>
          )}
        </div>
        <div className="metric-value-row">
          <span className="metric-value">{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
        {subtext && <div className="metric-subtext">{subtext}</div>}
        {typeof barPercent === 'number' && (
          <div className="metric-bar-track">
            <div
              className="metric-bar-fill"
              style={{ width: `${Math.max(0, Math.min(100, barPercent))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
