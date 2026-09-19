import React from 'react';
import { useRover } from '../../context/RoverContext';
import {
  Sparkles,
  AlertTriangle,
  BatteryLow,
  WifiOff,
  Flame,
  RotateCcw
} from 'lucide-react';

export const SimulationPanel = () => {
  const {
    simulateObstacle,
    simulateLowBattery,
    simulateWeakSignal,
    simulateEmergency,
    resetSimulation
  } = useRover();

  return (
    <div className="dashboard-card simulation-card">
      <div className="card-header">
        <div className="card-title">
          <Sparkles size={18} />
          <span>Disaster Scenario Simulation Testing</span>
        </div>
        <div className="card-badge" style={{ color: 'var(--accent-purple)' }}>
          SANDBOX FAULT INJECTION
        </div>
      </div>

      <div className="sim-btn-grid">
        {/* 1. Simulate Obstacle */}
        <button
          id="btn-sim-obstacle"
          className="sim-btn hazard"
          onClick={simulateObstacle}
          title="Inject an unexpected debris obstacle into rover's sector"
        >
          <AlertTriangle size={18} />
          <span>Spawn Obstacle</span>
        </button>

        {/* 2. Simulate Low Battery */}
        <button
          id="btn-sim-battery"
          className="sim-btn battery"
          onClick={simulateLowBattery}
          title="Simulate rapid battery degradation to 14.5%"
        >
          <BatteryLow size={18} />
          <span>Simulate Low Batt</span>
        </button>

        {/* 3. Simulate Weak Signal */}
        <button
          id="btn-sim-signal"
          className="sim-btn signal"
          onClick={simulateWeakSignal}
          title="Inject RF signal attenuation and packet latency"
        >
          <WifiOff size={18} />
          <span>Simulate Jammed RF</span>
        </button>

        {/* 4. Simulate Emergency / Overheat */}
        <button
          id="btn-sim-emergency"
          className="sim-btn emergency"
          onClick={simulateEmergency}
          title="Simulate motor core overheating & emergency auto-halt"
        >
          <Flame size={18} />
          <span>Trigger Emergency</span>
        </button>

        {/* 5. Reset Simulation */}
        <button
          id="btn-sim-reset"
          className="sim-btn reset"
          onClick={resetSimulation}
          title="Restore rover telemetry and map state to default"
        >
          <RotateCcw size={18} />
          <span>Reset Mission</span>
        </button>
      </div>
    </div>
  );
};
