import React, { useState, useEffect } from 'react';
import { useRover } from '../../context/RoverContext';
import {
  Crosshair,
  MapPin,
  Search,
  Activity,
  Layers,
  Flame,
  Radio,
  Sliders,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Compass,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square
} from 'lucide-react';

const SECTOR_HUBS = [
  { id: 'hub-1', name: 'Hawthorne Sector', x: 340, y: 560, severity: 6.3, status: 'EPICENTER', color: '#ffd32a' },
  { id: 'hub-2', name: 'Diamond Bar Void', x: 620, y: 280, severity: 4.8, status: 'CRITICAL', color: '#ff4757' },
  { id: 'hub-3', name: 'Baldwin Park Hub', x: 580, y: 260, severity: 2.4, status: 'SURVIVOR BEACON', color: '#2ed573' },
  { id: 'hub-4', name: 'Alhambra Shelter', x: 480, y: 250, severity: 1.6, status: 'STABLE', color: '#00f2fe' },
  { id: 'hub-5', name: 'Calabasas Pass', x: 240, y: 200, severity: 3.2, status: 'BLOCKED', color: '#ffa502' },
  { id: 'hub-6', name: 'Eastvale Outpost', x: 740, y: 390, severity: 1.2, status: 'CLEAR', color: '#2ed573' },
  { id: 'hub-7', name: 'Lake Forest Base', x: 700, y: 700, severity: 1.0, status: 'NOMINAL', color: '#00f2fe' }
];

const TIMELINE_DAYS = [
  'Feb 23', '24', '25', '26', '27', '28', 'Mar 01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
];

const HISTOGRAM_BARS = [
  45, 60, 75, 50, 40, 85, 90, 70, 65, 55, 45, 80, 75, 60, 50, 65, 85, 95, 70, 60, 75, 80, 65, 50, 70, 60, 55, 45, 40, 35
];

export const GisCommandMap = () => {
  const { roverState, moveRover, obstacles } = useRover();
  const [selectedHub, setSelectedHub] = useState(SECTOR_HUBS[0]);
  const [activeChartTab, setActiveChartTab] = useState('nearest'); // 'nearest' | 'damages'
  const [selectedDayIdx, setSelectedDayIdx] = useState(8); // '03'
  const [searchQuery, setSearchQuery] = useState('');
  const [showPilotControls, setShowPilotControls] = useState(true);

  // Map rover 10x10 coordinates to SVG 1000x800 coordinate space
  const roverMapX = 150 + roverState.position.x * 70;
  const roverMapY = 120 + roverState.position.y * 60;

  return (
    <div className="gis-command-container">
      {/* Top Floating GIS Search & Map HUD Toolbar */}
      <div className="gis-top-toolbar">
        <div className="gis-search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search sector, hazard, or coordinates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="gis-kpi-bar">
          <div className="kpi-item">
            <span className="kpi-num" style={{ color: '#ffd32a' }}>12</span>
            <span className="kpi-txt">Number of Hazards</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-num" style={{ color: '#00f2fe' }}>4</span>
            <span className="kpi-txt">Avg Frequency (Hz)</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-num" style={{ color: '#ff4757' }}>6.3</span>
            <span className="kpi-txt">Max Severity</span>
          </div>
          <div className="kpi-item">
            <span className="kpi-num" style={{ color: '#2ed573' }}>1.2</span>
            <span className="kpi-txt">Min Severity</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Satellite GIS Canvas */}
      <div className="gis-map-viewport">
        {/* Grayscale Satellite Relief Base Image */}
        <img
          src="/satellite-relief.jpg"
          alt="Satellite Topographic Relief"
          className="gis-satellite-bg"
        />

        {/* SVG Tactical HUD Vector Layer */}
        <svg
          viewBox="0 0 1000 800"
          className="gis-svg-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Diagonal Red Striped Hazard Pattern for Fault Zone */}
            <pattern id="hazardStripePattern" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#ff4757" strokeWidth="3.5" opacity="0.9" />
            </pattern>

            {/* Diagonal Teal Striped Chart Pattern */}
            <pattern id="chartStripePattern" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0, 242, 254, 0.4)" strokeWidth="2" />
            </pattern>

            {/* Concentric Glow Filter */}
            <filter id="epicenterGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Fault / Collapse Hazard Corridor (Outer Translucent Green Buffer) */}
          <path
            d="M 200 240 L 320 280 L 350 480 L 330 620 L 460 650 L 580 690 L 640 760 L 590 790 L 480 730 L 380 690 L 290 670 L 290 480 L 260 300 L 160 270 Z"
            fill="rgba(30, 77, 65, 0.45)"
            stroke="rgba(46, 213, 115, 0.5)"
            strokeWidth="1.5"
          />

          {/* Fault / Collapse Hazard Corridor (Inner Diagonal Red Striped Core) */}
          <path
            d="M 200 280 L 300 310 L 330 480 L 310 610 L 440 640 L 560 680 L 610 740 L 560 760 L 440 700 L 350 670 L 270 640 L 270 480 L 240 330 L 170 300 Z"
            fill="url(#hazardStripePattern)"
            stroke="#ff4757"
            strokeWidth="2"
            opacity="0.95"
          />

          {/* Epicenter Concentric Impact Rings (Hawthorne Zone) */}
          <g transform="translate(360, 560)">
            {/* Outer Translucent Yellow Danger Radius */}
            <circle r="70" fill="rgba(255, 211, 42, 0.18)" stroke="rgba(255, 211, 42, 0.6)" strokeWidth="1.5" strokeDasharray="4 2" />
            <circle r="42" fill="rgba(255, 211, 42, 0.28)" stroke="rgba(255, 211, 42, 0.8)" strokeWidth="2" />
            
            {/* Core Pulsing Epicenter */}
            <circle r="16" fill="#ffd32a" filter="url(#epicenterGlow)">
              <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="6" fill="#ffffff" />
            
            {/* Vector Connector Rays from Epicenter to Surrounding Impact Hubs */}
            <line x1="0" y1="0" x2="60" y2="-60" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="0" y1="0" x2="100" y2="-40" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="0" y1="0" x2="90" y2="40" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="0" y1="0" x2="-20" y2="-80" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.2" strokeDasharray="3 3" />
          </g>

          {/* Radiating Rays around Diamond Bar Cluster */}
          <g transform="translate(630, 275)">
            <circle r="22" fill="none" stroke="rgba(255, 71, 87, 0.6)" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle r="8" fill="#ff4757" />
            <line x1="0" y1="0" x2="35" y2="45" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="0" x2="45" y2="-15" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* Sector Hubs / Geographic Markers */}
          {SECTOR_HUBS.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            return (
              <g
                key={hub.id}
                transform={`translate(${hub.x}, ${hub.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedHub(hub)}
              >
                {/* Outer Ring */}
                <circle
                  r={isSelected ? 14 : 9}
                  fill="none"
                  stroke={hub.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity="0.8"
                />
                {/* Center Dot */}
                <circle
                  r={isSelected ? 6 : 4}
                  fill={hub.color}
                />
                {/* Label */}
                <text
                  x="14"
                  y="4"
                  fill="#f1f5f9"
                  fontSize="11"
                  fontFamily="var(--font-sans)"
                  fontWeight={isSelected ? "700" : "500"}
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.95)' }}
                >
                  {hub.name}
                </text>
              </g>
            );
          })}

          {/* Random Scatter Minor Hazard Nodes */}
          {[
            { x: 470, y: 170, c: '#00f2fe' },
            { x: 540, y: 220, c: '#ffd32a' },
            { x: 570, y: 190, c: '#ff4757' },
            { x: 670, y: 230, c: '#ff4757' },
            { x: 670, y: 360, c: '#00f2fe' },
            { x: 710, y: 390, c: '#00f2fe' },
            { x: 535, y: 310, c: '#ffd32a' },
            { x: 535, y: 400, c: '#00f2fe' },
            { x: 580, y: 370, c: '#ff4757' }
          ].map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r="3.5"
              fill={dot.c}
              opacity="0.85"
            />
          ))}

          {/* Live Autonomous Rescue Rover Marker on Satellite GIS Grid */}
          <g
            transform={`translate(${roverMapX}, ${roverMapY})`}
            filter="url(#epicenterGlow)"
            style={{ transition: 'transform 0.4s ease-out' }}
          >
            <circle r="22" fill="none" stroke="#00f2fe" strokeWidth="2" strokeDasharray="4 2">
              <animate attributeName="r" values="15;30;15" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle r="14" fill="#0f172a" stroke="#00f2fe" strokeWidth="2.5" />
            <g transform={`rotate(${roverState.heading})`}>
              <polygon points="0,-9 6,5 0,1 -6,5" fill="#00f2fe" />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
            </g>
            <text y="-18" textAnchor="middle" fill="#00f2fe" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold">
              RESCUE ROVER-01
            </text>
          </g>
        </svg>

        {/* Floating Left GIS Incident Cards (Matching Reference Screenshot) */}
        <div className="gis-left-sidebar">
          {/* Card 1: Last Recorded Hazard */}
          <div className="gis-incident-card">
            <div className="inc-card-head">
              <span className="inc-title">Last recorded hazard</span>
              <span className="inc-badge" style={{ background: 'rgba(46, 213, 115, 0.2)', color: '#2ed573', border: '1px solid #2ed573' }}>
                Magnitude 1.6
              </span>
            </div>
            <div className="inc-loc">6729 mi South West of Sector Alpha</div>
            <div className="inc-grid-meta">
              <div>
                <div className="meta-k">Date</div>
                <div className="meta-v">2/24/2026</div>
              </div>
              <div>
                <div className="meta-k">Time</div>
                <div className="meta-v">1:40 AM</div>
              </div>
              <div>
                <div className="meta-k">Source</div>
                <div className="meta-v">GHNZ</div>
              </div>
              <div>
                <div className="meta-k">Depth / Range</div>
                <div className="meta-v">6.42 mi</div>
              </div>
              <div>
                <div className="meta-k">Latitude</div>
                <div className="meta-v">-41°26'52"</div>
              </div>
              <div>
                <div className="meta-k">Longitude</div>
                <div className="meta-v">+174°39'53"</div>
              </div>
            </div>
          </div>

          {/* Card 2: Hazards in Last 24 Hours */}
          <div className="gis-incident-card">
            <div className="inc-card-head">
              <span className="inc-title">Hazards in last 24h</span>
              <span className="inc-badge" style={{ background: 'rgba(46, 213, 115, 0.2)', color: '#2ed573', border: '1px solid #2ed573' }}>
                Magnitude 1.6
              </span>
            </div>
            <div className="inc-loc">71 mi East of Base Sector</div>
            <div className="inc-grid-meta">
              <div>
                <div className="meta-k">Date</div>
                <div className="meta-v">2/23/2026</div>
              </div>
              <div>
                <div className="meta-k">Time</div>
                <div className="meta-v">7:01 PM</div>
              </div>
              <div>
                <div className="meta-k">Source</div>
                <div className="meta-v">EMSC</div>
              </div>
              <div>
                <div className="meta-k">Depth / Range</div>
                <div className="meta-v">10.56 mi</div>
              </div>
              <div>
                <div className="meta-k">Latitude</div>
                <div className="meta-v">+34°01'48"</div>
              </div>
              <div>
                <div className="meta-k">Longitude</div>
                <div className="meta-v">-117°01'11"</div>
              </div>
            </div>
          </div>

          {/* Card 3: Nearest Hazards */}
          <div className="gis-incident-card">
            <div className="inc-card-head">
              <span className="inc-title">Nearest hazards</span>
              <span className="inc-badge" style={{ background: 'rgba(46, 213, 115, 0.2)', color: '#2ed573', border: '1px solid #2ed573' }}>
                Magnitude 1.6
              </span>
            </div>
            <div className="inc-loc">782 mi East of Incident Center</div>
            <div className="inc-grid-meta">
              <div>
                <div className="meta-k">Date</div>
                <div className="meta-v">2/23/2026</div>
              </div>
              <div>
                <div className="meta-k">Time</div>
                <div className="meta-v">7:36 PM</div>
              </div>
              <div>
                <div className="meta-k">Source</div>
                <div className="meta-v">EMSC</div>
              </div>
              <div>
                <div className="meta-k">Depth / Range</div>
                <div className="meta-v">3.11 mi</div>
              </div>
              <div>
                <div className="meta-k">Latitude</div>
                <div className="meta-v">+36°58'11"</div>
              </div>
              <div>
                <div className="meta-k">Longitude</div>
                <div className="meta-v">-104°49'47"</div>
              </div>
            </div>
          </div>

          {/* Card 4: Strongest Hazard in the Period */}
          <div className="gis-incident-card highlighted">
            <div className="inc-card-head">
              <span className="inc-title">Strongest hazard in period</span>
              <span className="inc-badge" style={{ background: 'rgba(255, 107, 107, 0.25)', color: '#ff6b81', border: '1px solid #ff4757', fontWeight: 'bold' }}>
                Magnitude 6.3
              </span>
            </div>
            <div className="inc-loc">{selectedHub.name} (Active Epicenter)</div>
            <div className="inc-grid-meta">
              <div>
                <div className="meta-k">Date</div>
                <div className="meta-v">2/23/2026</div>
              </div>
              <div>
                <div className="meta-k">Time</div>
                <div className="meta-v">7:02 PM</div>
              </div>
              <div>
                <div className="meta-k">Source</div>
                <div className="meta-v">TMD USAR</div>
              </div>
              <div>
                <div className="meta-k">Severity</div>
                <div className="meta-v" style={{ color: '#ff4757', fontWeight: 'bold' }}>CRITICAL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Map Legend (Bottom-Left) */}
        <div className="gis-floating-legend">
          <div className="gis-legend-row">
            <div className="legend-hatch-box" />
            <span>Possible source of hazards / Faultline</span>
          </div>
          <div className="gis-legend-row">
            <div className="legend-solid-box" />
            <span>Radius of possible hazard source</span>
          </div>
        </div>

        {/* Quick Floating Rover Pilot Controls */}
        <div className="gis-floating-controls">
          <div className="floating-ctrl-header">
            <span>Pilot: [{roverState.position.x}, {roverState.position.y}]</span>
            <button
              onClick={() => setShowPilotControls(v => !v)}
              className="ctrl-minimize-btn"
            >
              {showPilotControls ? '−' : '+'}
            </button>
          </div>

          {showPilotControls && (
            <div className="floating-dpad">
              <button onClick={() => moveRover('forward')} className="fl-btn" title="Forward (W / ↑)">
                <ArrowUp size={16} />
              </button>
              <div className="fl-row">
                <button onClick={() => moveRover('left')} className="fl-btn" title="Left (A / ←)">
                  <ArrowLeft size={16} />
                </button>
                <button onClick={() => moveRover('stop')} className="fl-btn fl-brake" title="Brake (Space)">
                  <Square size={13} />
                </button>
                <button onClick={() => moveRover('right')} className="fl-btn" title="Right (D / →)">
                  <ArrowRight size={16} />
                </button>
              </div>
              <button onClick={() => moveRover('backward')} className="fl-btn" title="Reverse (S / ↓)">
                <ArrowDown size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Interactive Seismic / Hazard Charts & Timeline Scrubber */}
        <div className="gis-bottom-charts">
          <div className="chart-header-row">
            <div className="chart-title-left">
              <span className="chart-main-title">CHARTS</span>
              <div className="chart-pill-toggles">
                <button
                  className={`chart-pill ${activeChartTab === 'nearest' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('nearest')}
                >
                  Nearest hazards
                </button>
                <button
                  className={`chart-pill ${activeChartTab === 'damages' ? 'active' : ''}`}
                  onClick={() => setActiveChartTab('damages')}
                >
                  Damages
                </button>
              </div>
            </div>

            <div className="chart-filter-right">
              <span>Filter by: <b>Month</b></span>
            </div>
          </div>

          {/* Histogram Chart Bars with Diagonal Stripes */}
          <div className="histogram-container">
            {HISTOGRAM_BARS.map((height, idx) => {
              const isSelectedDay = idx === selectedDayIdx;
              return (
                <div
                  key={idx}
                  className={`histogram-bar-wrap ${isSelectedDay ? 'selected' : ''}`}
                  onClick={() => setSelectedDayIdx(idx)}
                  title={`Activity Level: ${height}%`}
                >
                  <div
                    className="histogram-bar"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Timeline Days Scrubber */}
          <div className="timeline-scrubber">
            {TIMELINE_DAYS.map((day, idx) => {
              const isSelected = idx === selectedDayIdx;
              return (
                <div
                  key={idx}
                  className={`scrubber-node ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedDayIdx(idx)}
                >
                  <span>{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
