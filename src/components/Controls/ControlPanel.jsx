import React from 'react';
import { useRover } from '../../context/RoverContext';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Square,
  Gauge,
  Sliders,
  Bot,
  UserCheck,
  ZapOff,
  Keyboard
} from 'lucide-react';

export const ControlPanel = () => {
  const { roverState, moveRover, setTargetSpeed, toggleMode } = useRover();
  const isAutonomous = roverState.mode === 'Autonomous';
  const isEstop = roverState.emergencyStop;

  return (
    <div className="dashboard-card control-card">
      <div className="card-header">
        <div className="card-title">
          <Sliders size={18} />
          <span>Rover Pilot Station</span>
        </div>
        <div className="card-badge" style={{ color: isAutonomous ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
          {isAutonomous ? 'AUTOPILOT ENGAGED' : 'MANUAL PILOT'}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="mode-toggle-box">
        <button
          id="btn-mode-auto"
          className={`mode-btn ${isAutonomous ? 'active' : ''}`}
          onClick={isAutonomous ? undefined : toggleMode}
        >
          <Bot size={16} />
          <span>Autonomous AI</span>
        </button>
        <button
          id="btn-mode-manual"
          className={`mode-btn ${!isAutonomous ? 'active' : ''}`}
          onClick={!isAutonomous ? undefined : toggleMode}
        >
          <UserCheck size={16} />
          <span>Manual Remote</span>
        </button>
      </div>

      {/* Directional D-Pad */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Directional Thrusters
        </div>

        <div className="dpad-container">
          {/* Row 1 */}
          <div />
          <button
            id="btn-move-forward"
            className="dpad-btn"
            onClick={() => moveRover('forward')}
            disabled={isEstop}
            title="Move Forward (W / Up Arrow)"
          >
            <ArrowUp size={22} />
            <span className="dpad-shortcut">W / ↑</span>
          </button>
          <div />

          {/* Row 2 */}
          <button
            id="btn-move-left"
            className="dpad-btn"
            onClick={() => moveRover('left')}
            disabled={isEstop}
            title="Pivot Left (A / Left Arrow)"
          >
            <ArrowLeft size={22} />
            <span className="dpad-shortcut">A / ←</span>
          </button>
          <button
            id="btn-move-stop"
            className="dpad-btn dpad-center"
            onClick={() => moveRover('stop')}
            title="Emergency Brake (Space)"
          >
            <Square size={20} />
            <span className="dpad-shortcut">BRAKE</span>
          </button>
          <button
            id="btn-move-right"
            className="dpad-btn"
            onClick={() => moveRover('right')}
            disabled={isEstop}
            title="Pivot Right (D / Right Arrow)"
          >
            <ArrowRight size={22} />
            <span className="dpad-shortcut">D / →</span>
          </button>

          {/* Row 3 */}
          <div />
          <button
            id="btn-move-backward"
            className="dpad-btn"
            onClick={() => moveRover('backward')}
            disabled={isEstop}
            title="Move Reverse (S / Down Arrow)"
          >
            <ArrowDown size={22} />
            <span className="dpad-shortcut">S / ↓</span>
          </button>
          <div />
        </div>
      </div>

      {/* Speed Slider / Throttle Limit */}
      <div className="throttle-control">
        <div className="throttle-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
            <Gauge size={15} /> Motor Throttle Target
          </span>
          <span className="throttle-value">{roverState.targetSpeed.toFixed(1)} km/h</span>
        </div>
        <input
          id="slider-target-speed"
          type="range"
          min="1.0"
          max="15.0"
          step="0.5"
          value={roverState.targetSpeed}
          onChange={(e) => setTargetSpeed(e.target.value)}
          className="custom-slider"
          disabled={isEstop}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          <span>1.0 km/h (Precise)</span>
          <span>7.5 km/h</span>
          <span>15.0 km/h (Sprint)</span>
        </div>
      </div>

      {/* Keyboard Controls Hint */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.74rem',
        color: 'var(--text-muted)',
        background: 'rgba(255,255,255,0.02)',
        padding: '0.5rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        <Keyboard size={15} style={{ color: 'var(--accent-cyan)' }} />
        <span>Use keyboard <b>WASD</b> or <b>Arrow Keys</b> for rapid manual piloting.</span>
      </div>

      {/* E-Stop Notice if Active */}
      {isEstop && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-rose)',
          background: 'rgba(244,63,94,0.12)',
          padding: '0.6rem 0.8rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(244,63,94,0.3)'
        }}>
          <ZapOff size={16} />
          <span><b>EMERGENCY STOP ACTIVE:</b> Motor power disconnected. Disengage E-STOP to maneuver.</span>
        </div>
      )}
    </div>
  );
};
