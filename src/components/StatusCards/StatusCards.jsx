import React from 'react';
import { useRover } from '../../context/RoverContext';
import { MetricCard } from './MetricCard';
import {
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
  Thermometer,
  Wifi,
  Gauge,
  Bot,
  Radio,
  Cpu
} from 'lucide-react';

export const StatusCards = () => {
  const { roverState, toggleMode } = useRover();

  // Battery config
  let batteryColor = 'var(--accent-emerald)';
  let BatteryIcon = BatteryCharging;
  let batteryStatus = 'Normal';
  if (roverState.battery <= 20) {
    batteryColor = 'var(--accent-rose)';
    BatteryIcon = BatteryWarning;
    batteryStatus = 'Critical';
  } else if (roverState.battery <= 50) {
    batteryColor = 'var(--accent-amber)';
    BatteryIcon = BatteryMedium;
    batteryStatus = 'Moderate';
  }

  // Temperature config
  let tempColor = 'var(--accent-emerald)';
  let tempStatus = 'Nominal';
  if (roverState.temperature >= 70) {
    tempColor = 'var(--accent-rose)';
    tempStatus = 'Overheat';
  } else if (roverState.temperature >= 50) {
    tempColor = 'var(--accent-amber)';
    tempStatus = 'Elevated';
  }

  // Signal config
  let signalColor = 'var(--accent-cyan)';
  let signalStatus = 'Strong';
  if (roverState.signalStrength <= 30) {
    signalColor = 'var(--accent-rose)';
    signalStatus = 'Weak';
  } else if (roverState.signalStrength <= 60) {
    signalColor = 'var(--accent-amber)';
    signalStatus = 'Fair';
  }

  // Mode config
  const isAuto = roverState.mode === 'Autonomous';

  return (
    <section className="grid-status-cards" aria-label="Rover Telemetry HUD">
      {/* 1. Battery Percentage */}
      <MetricCard
        icon={BatteryIcon}
        label="Power Reserve"
        value={`${roverState.battery.toFixed(0)}%`}
        unit=""
        subtext={`Status: ${batteryStatus} • ~${(roverState.battery * 0.12).toFixed(1)}h remaining`}
        barPercent={roverState.battery}
        accentColor={batteryColor}
        badgeText={roverState.batteryCharging ? 'CHARGING' : `${roverState.battery.toFixed(0)}%`}
      />

      {/* 2. Core Temperature */}
      <MetricCard
        icon={Thermometer}
        label="Core Thermals"
        value={roverState.temperature.toFixed(1)}
        unit="°C"
        subtext={`Threshold: <70.0°C • ${tempStatus}`}
        barPercent={(roverState.temperature / 90) * 100}
        accentColor={tempColor}
        badgeText={tempStatus.toUpperCase()}
      />

      {/* 3. RF Signal Strength */}
      <MetricCard
        icon={Wifi}
        label="RF Signal Link"
        value={`${roverState.signalStrength}%`}
        unit=""
        subtext={`SNR: -${(110 - roverState.signalStrength * 0.7).toFixed(0)} dBm • 5.8 GHz`}
        barPercent={roverState.signalStrength}
        accentColor={signalColor}
        badgeText={signalStatus.toUpperCase()}
      />

      {/* 4. Current Speed */}
      <MetricCard
        icon={Gauge}
        label="Live Velocity"
        value={roverState.speed.toFixed(1)}
        unit="km/h"
        subtext={`Throttle Limit: ${roverState.targetSpeed.toFixed(1)} km/h`}
        barPercent={(roverState.speed / 15) * 100}
        accentColor="var(--accent-cyan)"
        badgeText={roverState.speed > 0 ? 'CRUISING' : 'IDLE'}
      />

      {/* 5. Rover Mode */}
      <MetricCard
        icon={Bot}
        label="Navigation Mode"
        value={roverState.mode}
        unit=""
        subtext="Click card to toggle Autopilot / Pilot"
        barPercent={isAuto ? 100 : 50}
        accentColor={isAuto ? 'var(--accent-emerald)' : 'var(--accent-amber)'}
        badgeText={isAuto ? 'AI ACTIVE' : 'MANUAL'}
        onClick={toggleMode}
      />

      {/* 6. Connection Status */}
      <MetricCard
        icon={Radio}
        label="Telemetry Link"
        value={roverState.connectionStatus}
        unit=""
        subtext={`Latency: ${roverState.ping} ms • Zero Packet Loss`}
        barPercent={roverState.connectionStatus === 'Connected' ? 100 : 40}
        accentColor={roverState.connectionStatus === 'Connected' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}
        badgeText="PRIMARY"
      />
    </section>
  );
};
