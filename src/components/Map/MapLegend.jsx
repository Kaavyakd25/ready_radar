import React from 'react';

export const MapLegend = () => {
  return (
    <div className="map-legend-container">
      <div className="legend-item">
        <span className="legend-swatch" style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 6px var(--accent-cyan)' }} />
        <span>Rescue Rover-01</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ background: '#10b981', borderRadius: '50%' }} />
        <span>Base Origin [1, 1]</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ background: '#f59e0b', border: '1px dashed #f59e0b' }} />
        <span>Target Sector [8, 8]</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ background: 'rgba(0, 242, 254, 0.4)' }} />
        <span>Traveled Path</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ background: 'rgba(244, 63, 94, 0.7)' }} />
        <span>Critical Hazard / Obstacle</span>
      </div>
      <div className="legend-item">
        <span className="legend-swatch" style={{ background: 'rgba(59, 130, 246, 0.35)', border: '1px solid #3b82f6' }} />
        <span>Flood / Collapse Zone</span>
      </div>
    </div>
  );
};
