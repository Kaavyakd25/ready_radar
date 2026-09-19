import React, { useState, useEffect } from 'react';
import { useRover } from '../../context/RoverContext';
import {
  ShieldAlert,
  Radio,
  Clock,
  AlertOctagon,
  Zap,
  Image as ImageIcon,
  Map,
  Activity,
  Cpu,
  PackageCheck,
  Sparkles,
  Menu
} from 'lucide-react';

const THEMES = [
  { id: 'topographic', name: 'Topographic HUD', className: '' },
  { id: 'command', name: 'Tactical Ops Room', className: 'theme-command' },
  { id: 'minimal', name: 'Cyber Grid (Minimal)', className: 'theme-minimal' }
];

const NAV_TABS = [
  { id: 'overview', name: 'Overview', icon: Map },
  { id: 'telemetry', name: 'Real-Time Activity', icon: Activity },
  { id: 'hazards', name: 'Prediction', icon: Cpu },
  { id: 'delivery', name: 'History / Logistics', icon: PackageCheck },
  { id: 'simulation', name: 'Comparison / Sim', icon: Sparkles }
];

export const Header = ({ activeTab, setActiveTab }) => {
  const { roverState, triggerEmergencyStop } = useRover();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const nextIdx = (currentThemeIdx + 1) % THEMES.length;
    setCurrentThemeIdx(nextIdx);
    document.body.className = THEMES[nextIdx].className;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDegraded = roverState.connectionStatus === 'Degraded';
  const isOffline = roverState.connectionStatus === 'Disconnected' || roverState.battery <= 0;

  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Project & Rover Designation */}
        <div className="header-brand">
          <div className="brand-icon-wrapper" style={{ borderRadius: '8px' }}>
            <Radio size={22} />
          </div>
          <div className="brand-text">
            <h1>Titanic Plates • ReadyRadar</h1>
            <div className="brand-subtitle">
              <span>Disaster Response UGV</span>
              <span className="rover-tag">{roverState.name}</span>
            </div>
          </div>
        </div>

        {/* Segmented Navigation Tabs (Matching Reference Image) */}
        <div style={{
          display: 'flex',
          background: 'rgba(6, 11, 23, 0.85)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          gap: '2px'
        }}>
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: 'var(--font-sans)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? '#1e293b' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
                }}
              >
                <Icon size={14} style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit' }} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Live Metrics & Telemetry Pill */}
        <div className="header-meta">
          {/* Wallpaper Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="card-badge"
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid var(--border-cyan)',
              background: 'rgba(0, 242, 254, 0.08)',
              color: 'var(--accent-cyan)',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s ease'
            }}
            title="Click to cycle dashboard background wallpaper"
          >
            <ImageIcon size={14} />
            <span>Theme: {THEMES[currentThemeIdx].name}</span>
          </button>

          <div className={`meta-status-pill ${isOffline ? 'offline' : isDegraded ? 'degraded' : ''}`}>
            <span className="status-dot animate-pulse"></span>
            <span>{isOffline ? 'OFFLINE' : roverState.connectionStatus.toUpperCase()}</span>
            <span style={{ opacity: 0.6, fontSize: '0.72rem' }}>({roverState.ping}ms)</span>
          </div>

          <div className="header-clock">
            <div className="clock-time">
              <Clock size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
              {formatTime(currentTime)} <span style={{ fontSize: '0.7rem', color: 'var(--text-cyan)' }}>UTC</span>
            </div>
            <div className="clock-date">{formatDate(currentTime)}</div>
          </div>

          {/* Emergency Stop Button */}
          <button
            id="btn-emergency-stop"
            className={`btn-estop ${roverState.emergencyStop ? 'active animate-alert-flash' : ''}`}
            onClick={triggerEmergencyStop}
            title={roverState.emergencyStop ? "Click to disengage Emergency Stop" : "Click to trigger immediate Emergency Stop"}
          >
            <AlertOctagon size={18} />
            <span>{roverState.emergencyStop ? "E-STOP ENGAGED" : "EMERGENCY STOP"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
