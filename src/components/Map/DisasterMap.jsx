import React, { useState } from 'react';
import { useRover } from '../../context/RoverContext';
import { MapLegend } from './MapLegend';
import {
  Compass,
  Crosshair,
  MapPin,
  Maximize2,
  Navigation,
  Eye,
  Flame,
  Zap,
  Radio,
  Satellite
} from 'lucide-react';

const MAP_THEMES = [
  {
    id: 'tactical',
    name: 'Tactical HUD',
    icon: Navigation,
    badgeColor: 'var(--accent-cyan)',
    bg: '#070c18',
    gridColor: 'rgba(0, 242, 254, 0.09)',
    radarColor: '#00f2fe',
    roverColor: '#00f2fe',
    pathColor: '#00f2fe',
    routeLine: 'rgba(0, 242, 254, 0.4)',
    baseColor: '#10b981',
    targetColor: '#f59e0b',
    border: 'rgba(0, 242, 254, 0.25)',
    filter: 'none'
  },
  {
    id: 'thermal',
    name: 'FLIR Thermal',
    icon: Flame,
    badgeColor: '#ff4757',
    bg: '#140518',
    gridColor: 'rgba(255, 71, 87, 0.12)',
    radarColor: '#ff4757',
    roverColor: '#ffd32a',
    pathColor: '#ff6b81',
    routeLine: 'rgba(255, 71, 87, 0.4)',
    baseColor: '#2ed573',
    targetColor: '#ff7f50',
    border: 'rgba(255, 71, 87, 0.35)',
    filter: 'contrast(1.15) brightness(1.05)'
  },
  {
    id: 'nvg',
    name: 'Night Vision NVG',
    icon: Eye,
    badgeColor: '#2ed573',
    bg: '#031406',
    gridColor: 'rgba(46, 213, 115, 0.12)',
    radarColor: '#2ed573',
    roverColor: '#7bed9f',
    pathColor: '#2ed573',
    routeLine: 'rgba(46, 213, 115, 0.4)',
    baseColor: '#70a1ff',
    targetColor: '#eccc68',
    border: 'rgba(46, 213, 115, 0.35)',
    filter: 'hue-rotate(60deg) contrast(1.1)'
  },
  {
    id: 'lidar',
    name: 'LIDAR Satellite',
    icon: Satellite,
    badgeColor: '#f59e0b',
    bg: '#120d04',
    gridColor: 'rgba(245, 158, 11, 0.12)',
    radarColor: '#f59e0b',
    roverColor: '#ffa502',
    pathColor: '#e58e26',
    routeLine: 'rgba(245, 158, 11, 0.4)',
    baseColor: '#2ed573',
    targetColor: '#ff4757',
    border: 'rgba(245, 158, 11, 0.35)',
    filter: 'none'
  }
];

export const DisasterMap = () => {
  const { roverState, obstacles, dangerZones } = useRover();
  const [hoveredCell, setHoveredCell] = useState(null);
  const [activeThemeId, setActiveThemeId] = useState('tactical');

  const activeTheme = MAP_THEMES.find(t => t.id === activeThemeId) || MAP_THEMES[0];

  const GRID_SIZE = 10;
  const CELL_SIZE = 50; // 500x500 viewBox

  const roverX = roverState.position.x;
  const roverY = roverState.position.y;
  const roverPixelX = roverX * CELL_SIZE + CELL_SIZE / 2;
  const roverPixelY = roverY * CELL_SIZE + CELL_SIZE / 2;

  // Project safe route line from rover to destination
  const destPixelX = roverState.destination.x * CELL_SIZE + CELL_SIZE / 2;
  const destPixelY = roverState.destination.y * CELL_SIZE + CELL_SIZE / 2;

  // Generate safe path corridor points
  const safePathCorridor = [
    `${roverPixelX},${roverPixelY}`,
    `${destPixelX},${roverPixelY}`,
    `${destPixelX},${destPixelY}`
  ].join(' ');

  // Generate breadcrumb polyline points from path history
  const historyPoints = roverState.pathHistory
    .map(p => `${p.x * CELL_SIZE + CELL_SIZE / 2},${p.y * CELL_SIZE + CELL_SIZE / 2}`)
    .join(' ');

  return (
    <div className="dashboard-card map-card">
      <div className="card-header">
        <div className="card-title">
          <Navigation size={18} />
          <span>Disaster Sector Tactical Map</span>
        </div>

        {/* Map Theme Buttons */}
        <div className="map-header-controls" style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {MAP_THEMES.map((theme) => {
            const Icon = theme.icon;
            const isSelected = theme.id === activeThemeId;
            return (
              <button
                key={theme.id}
                onClick={() => setActiveThemeId(theme.id)}
                className="card-badge"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: isSelected ? `1px solid ${theme.badgeColor}` : '1px solid var(--border-subtle)',
                  background: isSelected ? `${theme.badgeColor}22` : 'transparent',
                  color: isSelected ? theme.badgeColor : 'var(--text-muted)',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.2s ease'
                }}
                title={`Switch to ${theme.name} map mode`}
              >
                <Icon size={12} />
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tactical Map Viewport */}
      <div
        className="map-viewport"
        style={{
          backgroundColor: activeTheme.bg,
          borderColor: activeTheme.border,
          boxShadow: `inset 0 0 50px rgba(0, 0, 0, 0.8), 0 0 20px ${activeTheme.border}`
        }}
      >
        {/* HUD Coordinate Overlays */}
        <div className="map-hud-overlay">
          <div className="hud-coord-pill" style={{ borderColor: activeTheme.border, color: activeTheme.roverColor }}>
            <Crosshair size={13} />
            <span>POS: [{roverX}, {roverY}]</span>
            <span style={{ opacity: 0.6 }}>| HEADING: {roverState.heading}°</span>
          </div>
          <div className="hud-coord-pill" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <MapPin size={13} />
            <span>DEST: [{roverState.destination.x}, {roverState.destination.y}]</span>
          </div>
          {hoveredCell && (
            <div className="hud-coord-pill" style={{ color: activeTheme.targetColor, borderColor: activeTheme.border }}>
              <span>INSPECT SECTOR: [{hoveredCell.x}, {hoveredCell.y}]</span>
            </div>
          )}
        </div>

        {/* SVG Tactical Disaster Grid */}
        <svg
          viewBox="0 0 500 500"
          className="map-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id={`gridPattern-${activeTheme.id}`} width={CELL_SIZE} height={CELL_SIZE} patternUnits="userSpaceOnUse">
              <path
                d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`}
                fill="none"
                stroke={activeTheme.gridColor}
                strokeWidth="1"
              />
              <circle cx={CELL_SIZE / 2} cy={CELL_SIZE / 2} r="1" fill={activeTheme.gridColor} />
            </pattern>

            {/* Dynamic Radar Sweep Gradient */}
            <linearGradient id={`radarSweepGrad-${activeTheme.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activeTheme.radarColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={activeTheme.radarColor} stopOpacity="0" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glow-theme" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="500" height="500" fill={activeTheme.bg} />
          <rect width="500" height="500" fill={`url(#gridPattern-${activeTheme.id})`} />

          {/* Radar Scanner Sweep Arc */}
          <g className="radar-sweep-line">
            <circle cx="250" cy="250" r="240" fill="none" stroke={activeTheme.gridColor} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="250" cy="250" r="160" fill="none" stroke={activeTheme.gridColor} strokeWidth="1" />
            <circle cx="250" cy="250" r="80" fill="none" stroke={activeTheme.gridColor} strokeWidth="1" />
            <path d="M 250 250 L 500 250 A 250 250 0 0 0 426 74 Z" fill={`url(#radarSweepGrad-${activeTheme.id})`} />
          </g>

          {/* Danger Zones Overlays */}
          {dangerZones.map(zone => (
            <g key={zone.id}>
              {zone.cells.map((cell, idx) => (
                <rect
                  key={idx}
                  x={cell.x * CELL_SIZE + 2}
                  y={cell.y * CELL_SIZE + 2}
                  width={CELL_SIZE - 4}
                  height={CELL_SIZE - 4}
                  rx="4"
                  fill={
                    zone.type === 'flood'
                      ? (activeThemeId === 'thermal' ? 'rgba(78, 205, 196, 0.25)' : 'rgba(59, 130, 246, 0.25)')
                      : zone.type === 'toxic'
                      ? (activeThemeId === 'nvg' ? 'rgba(46, 213, 115, 0.3)' : 'rgba(245, 158, 11, 0.25)')
                      : (activeThemeId === 'thermal' ? 'rgba(255, 71, 87, 0.45)' : 'rgba(244, 63, 94, 0.25)')
                  }
                  stroke={
                    zone.type === 'flood'
                      ? (activeThemeId === 'thermal' ? '#4ecdc4' : 'rgba(59, 130, 246, 0.6)')
                      : zone.type === 'toxic'
                      ? (activeThemeId === 'nvg' ? '#2ed573' : 'rgba(245, 158, 11, 0.6)')
                      : (activeThemeId === 'thermal' ? '#ff4757' : 'rgba(244, 63, 94, 0.6)')
                  }
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              ))}
            </g>
          ))}

          {/* Safe Projected Route Corridor */}
          <polyline
            points={safePathCorridor}
            fill="none"
            stroke={activeTheme.routeLine}
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Traveled Breadcrumb History Trail */}
          {roverState.pathHistory.length > 1 && (
            <polyline
              points={historyPoints}
              fill="none"
              stroke={activeTheme.pathColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          )}

          {/* Base Station Starting Point [1, 1] */}
          <g transform={`translate(${roverState.startPosition.x * CELL_SIZE + CELL_SIZE / 2}, ${roverState.startPosition.y * CELL_SIZE + CELL_SIZE / 2})`}>
            <circle r="14" fill="none" stroke={activeTheme.baseColor} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle r="7" fill={activeTheme.baseColor} opacity="0.8" />
            <text y="22" textAnchor="middle" fill={activeTheme.baseColor} fontSize="9" fontFamily="var(--font-mono)" fontWeight="bold">
              BASE
            </text>
          </g>

          {/* Target Destination Point [8, 8] */}
          <g transform={`translate(${roverState.destination.x * CELL_SIZE + CELL_SIZE / 2}, ${roverState.destination.y * CELL_SIZE + CELL_SIZE / 2})`}>
            <circle r="16" fill="none" stroke={activeTheme.targetColor} strokeWidth="2" strokeDasharray="4 2">
              <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="6" fill={activeTheme.targetColor} />
            <path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke={activeTheme.targetColor} strokeWidth="1.5" />
            <text y="24" textAnchor="middle" fill={activeTheme.targetColor} fontSize="9" fontFamily="var(--font-mono)" fontWeight="bold">
              TARGET
            </text>
          </g>

          {/* Obstacles Placed on Map */}
          {obstacles.map(obs => {
            const ox = obs.grid.x * CELL_SIZE + CELL_SIZE / 2;
            const oy = obs.grid.y * CELL_SIZE + CELL_SIZE / 2;
            const isCritical = obs.severity === 'CRITICAL';
            const isHigh = obs.severity === 'HIGH';
            
            let color = isCritical ? '#f43f5e' : isHigh ? '#f59e0b' : '#38bdf8';
            if (activeThemeId === 'thermal') {
              color = isCritical ? '#ff3838' : isHigh ? '#ff9f1a' : '#ffb8b8';
            } else if (activeThemeId === 'nvg') {
              color = isCritical ? '#ff5252' : isHigh ? '#fffa65' : '#2ed573';
            }

            return (
              <g key={obs.id} transform={`translate(${ox}, ${oy})`}>
                <rect
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  rx="4"
                  fill={`${color}33`}
                  stroke={color}
                  strokeWidth="1.5"
                />
                {/* Hazard indicator symbol */}
                <polygon
                  points="0,-6 6,5 -6,5"
                  fill={color}
                />
                <circle cx="0" cy="2" r="0.8" fill="#000" />
                <title>{`${obs.type} (${obs.severity}) - Distance: ${obs.distance}m`}</title>
              </g>
            );
          })}

          {/* Active Rover Position Marker */}
          <g
            transform={`translate(${roverPixelX}, ${roverPixelY})`}
            filter="url(#glow-theme)"
            style={{ transition: 'transform 0.3s ease-out' }}
          >
            {/* Pulsing Sonar Ping */}
            <circle r="20" fill="none" stroke={activeTheme.roverColor} strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="10;28;10" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Rover Body Outer Ring */}
            <circle r="14" fill="#0f172a" stroke={activeTheme.roverColor} strokeWidth="2.5" />

            {/* Directional Heading Chevron/Arrow */}
            <g transform={`rotate(${roverState.heading})`}>
              <polygon points="0,-10 7,6 0,2 -7,6" fill={activeTheme.roverColor} />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
            </g>

            <text y="-18" textAnchor="middle" fill={activeTheme.roverColor} fontSize="9" fontFamily="var(--font-mono)" fontWeight="bold">
              ROVER-01
            </text>
          </g>

          {/* Interactive Cell Hover Grid */}
          {Array.from({ length: GRID_SIZE }).map((_, gy) =>
            Array.from({ length: GRID_SIZE }).map((_, gx) => (
              <rect
                key={`${gx}-${gy}`}
                x={gx * CELL_SIZE}
                y={gy * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill="transparent"
                stroke="transparent"
                style={{ cursor: 'crosshair' }}
                onMouseEnter={() => setHoveredCell({ x: gx, y: gy })}
                onMouseLeave={() => setHoveredCell(null)}
              />
            ))
          )}
        </svg>
      </div>

      {/* Legend & Zone Types */}
      <MapLegend />
    </div>
  );
};
