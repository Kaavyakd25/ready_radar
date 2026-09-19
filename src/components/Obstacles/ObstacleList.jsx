import React from 'react';
import { useRover } from '../../context/RoverContext';
import {
  Radar,
  AlertTriangle,
  Droplets,
  Layers,
  Square,
  Mountain,
  ShieldCheck
} from 'lucide-react';

const getObstacleIcon = (type) => {
  if (type.includes('Water') || type.includes('Sinkhole') || type.includes('Mud')) return Droplets;
  if (type.includes('Rubble') || type.includes('Step') || type.includes('Mountain')) return Mountain;
  if (type.includes('Debris') || type.includes('Timber') || type.includes('Roof')) return Layers;
  if (type.includes('Concrete') || type.includes('Pillar') || type.includes('Block')) return Square;
  return AlertTriangle;
};

export const ObstacleList = () => {
  const { obstacles } = useRover();

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-title">
          <Radar size={18} />
          <span>Obstacle & Hazard Sonar</span>
        </div>
        <div className="card-badge" style={{ color: 'var(--accent-amber)' }}>
          {obstacles.length} DETECTED
        </div>
      </div>

      <div className="obstacle-list">
        {obstacles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={32} style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }} />
            <div>No immediate collision hazards detected. Sector is clear.</div>
          </div>
        ) : (
          obstacles.map((obs) => {
            const Icon = getObstacleIcon(obs.type);
            const sevLower = obs.severity.toLowerCase();
            return (
              <div key={obs.id} className="obstacle-item">
                <div className="obs-left">
                  <div className={`obs-icon ${sevLower}`}>
                    <Icon size={18} />
                  </div>
                  <div className="obs-info">
                    <span className="obs-title" title={obs.type}>
                      {obs.type}
                    </span>
                    <span className="obs-dist">
                      Sector [{obs.grid.x}, {obs.grid.y}] • <b>{obs.distance.toFixed(1)}m</b> distance
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`severity-pill ${sevLower}`}>
                    {obs.severity}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {obs.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
