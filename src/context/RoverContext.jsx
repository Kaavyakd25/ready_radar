import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_ROVER_STATE,
  INITIAL_OBSTACLES,
  INITIAL_DELIVERY,
  INITIAL_ALERTS,
  INITIAL_LOGS,
  DANGER_ZONES
} from '../data/initialData';

const RoverContext = createContext(null);

const getTimeString = () => {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
};

export const RoverProvider = ({ children }) => {
  const [roverState, setRoverState] = useState(INITIAL_ROVER_STATE);
  const [obstacles, setObstacles] = useState(INITIAL_OBSTACLES);
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [dangerZones] = useState(DANGER_ZONES);

  // Helper to add activity log
  const addLog = useCallback((tag, type, message) => {
    const newEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: getTimeString(),
      tag,
      type: type || 'info', // 'info' | 'warning' | 'critical' | 'success'
      message
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 49)]); // keep latest 50
  }, []);

  // Helper to add alert
  const addAlert = useCallback((title, message, level = 'normal') => {
    const newAlert = {
      id: `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: getTimeString(),
      title,
      message,
      level, // 'normal' | 'warning' | 'critical'
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  // Dismiss an alert
  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
    addLog('ALERT', 'info', 'All operational alerts cleared from HUD.');
  }, [addLog]);

  // Recalculate delivery progress based on rover position
  const updateDeliveryProgress = useCallback((posX, posY) => {
    const destX = 8;
    const destY = 8;
    const totalDist = Math.hypot(8 - 1, 8 - 1);
    const currDist = Math.hypot(destX - posX, destY - posY);
    const progress = Math.min(100, Math.max(0, Math.round(((totalDist - currDist) / totalDist) * 100)));
    const distanceMeters = (currDist * 7.5).toFixed(1);

    setDelivery(prev => {
      let status = "In Transit";
      if (progress >= 100 || (posX === destX && posY === destY)) {
        status = "Delivered";
      } else if (progress > 75) {
        status = "Approaching Target";
      }

      const estSeconds = Math.round(currDist * 35);
      const mins = Math.floor(estSeconds / 60);
      const secs = estSeconds % 60;
      const eta = status === "Delivered" ? "Completed" : `${mins}m ${secs}s`;

      return {
        ...prev,
        progress: status === "Delivered" ? 100 : progress,
        status,
        estimatedDistance: `${distanceMeters} m`,
        eta
      };
    });
  }, []);

  // Check collision / obstacle proximity
  const checkObstacleProximity = useCallback((posX, posY, currentObstacles) => {
    const hit = currentObstacles.find(o => o.grid.x === posX && o.grid.y === posY);
    if (hit) {
      addAlert(
        'Collision Hazard Detected',
        `Rover occupied grid [${posX}, ${posY}] matching obstacle: ${hit.type}!`,
        'critical'
      );
      addLog('HAZARD', 'critical', `Proximity breach at [${posX}, ${posY}]: ${hit.type}.`);
      return;
    }

    const nearby = currentObstacles.find(o => {
      const d = Math.hypot(o.grid.x - posX, o.grid.y - posY);
      return d <= 1.5;
    });

    if (nearby) {
      addAlert(
        'Obstacle Warning Ahead',
        `${nearby.type} detected ${(nearby.distance).toFixed(1)}m from current vector.`,
        'warning'
      );
    }
  }, [addAlert, addLog]);

  // Movement handler
  const moveRover = useCallback((direction) => {
    setRoverState(prev => {
      if (prev.emergencyStop) {
        addAlert('E-STOP ACTIVE', 'Cannot navigate while Emergency Stop is engaged.', 'critical');
        return prev;
      }

      let { x, y } = prev.position;
      let heading = prev.heading;
      let moved = false;

      if (direction === 'forward') {
        if (heading === 0 && y > 0) { y -= 1; moved = true; }
        else if (heading === 90 && x < 9) { x += 1; moved = true; }
        else if (heading === 180 && y < 9) { y += 1; moved = true; }
        else if (heading === 270 && x > 0) { x -= 1; moved = true; }
      } else if (direction === 'backward') {
        if (heading === 0 && y < 9) { y += 1; moved = true; }
        else if (heading === 90 && x > 0) { x -= 1; moved = true; }
        else if (heading === 180 && y > 0) { y -= 1; moved = true; }
        else if (heading === 270 && x < 9) { x += 1; moved = true; }
      } else if (direction === 'left') {
        heading = (heading - 90 + 360) % 360;
        addLog('NAV', 'info', `Rover pivoted left to heading ${heading}°.`);
        return { ...prev, heading, speed: Math.min(prev.speed + 1.2, prev.targetSpeed) };
      } else if (direction === 'right') {
        heading = (heading + 90) % 360;
        addLog('NAV', 'info', `Rover pivoted right to heading ${heading}°.`);
        return { ...prev, heading, speed: Math.min(prev.speed + 1.2, prev.targetSpeed) };
      } else if (direction === 'stop') {
        addLog('NAV', 'info', `Rover halted at coordinates [${x}, ${y}].`);
        return { ...prev, speed: 0.0 };
      }

      if (moved) {
        const newPos = { x, y };
        const newHistory = [...prev.pathHistory, newPos];
        const newSpeed = prev.targetSpeed;
        const newBattery = Math.max(5, prev.battery - 0.2); // minor drain per move

        addLog('NAV', 'info', `Rover advanced to [${x}, ${y}] at ${newSpeed} km/h.`);
        updateDeliveryProgress(x, y);
        checkObstacleProximity(x, y, obstacles);

        // Check if reached destination
        if (x === prev.destination.x && y === prev.destination.y) {
          addAlert('Mission Objective Achieved', 'Payload delivered to Target Sector [8, 8].', 'normal');
          addLog('MISSION', 'success', 'Aid payload successfully deployed at target coordinates!');
        }

        return {
          ...prev,
          position: newPos,
          heading,
          pathHistory: newHistory,
          speed: newSpeed,
          battery: parseFloat(newBattery.toFixed(1))
        };
      } else {
        addAlert('Boundary Limit', 'Sector perimeter reached. Cannot move beyond sector grid.', 'warning');
        return { ...prev, speed: 0.0 };
      }
    });
  }, [addAlert, addLog, updateDeliveryProgress, checkObstacleProximity, obstacles]);

  // Set speed slider
  const setTargetSpeed = useCallback((speedVal) => {
    const parsed = parseFloat(speedVal);
    setRoverState(prev => ({
      ...prev,
      targetSpeed: parsed,
      speed: prev.speed > 0 ? parsed : 0
    }));
    addLog('THROTTLE', 'info', `Motor throttle set to ${parsed.toFixed(1)} km/h.`);
  }, [addLog]);

  // Toggle Autonomous / Manual mode
  const toggleMode = useCallback(() => {
    setRoverState(prev => {
      const nextMode = prev.mode === 'Autonomous' ? 'Manual' : 'Autonomous';
      addLog('MODE', 'info', `Control mode toggled to ${nextMode.toUpperCase()}.`);
      addAlert('Mode Switch', `Rover switched to ${nextMode} control mode.`, 'normal');
      return { ...prev, mode: nextMode };
    });
  }, [addAlert, addLog]);

  // Emergency Stop Trigger
  const triggerEmergencyStop = useCallback(() => {
    setRoverState(prev => {
      const isStopping = !prev.emergencyStop;
      if (isStopping) {
        addAlert('EMERGENCY STOP ENGAGED', 'All drive motors locked. Beacon transmitting E-Stop state.', 'critical');
        addLog('E-STOP', 'critical', 'EMERGENCY STOP TRIGGERED BY OPERATOR.');
      } else {
        addAlert('E-Stop Disengaged', 'Motors unlocked. System returned to standby.', 'normal');
        addLog('E-STOP', 'info', 'Emergency stop cleared. Rover online.');
      }
      return {
        ...prev,
        emergencyStop: isStopping,
        speed: 0.0
      };
    });
  }, [addAlert, addLog]);

  // Simulation controls
  const simulateObstacle = useCallback(() => {
    const randomTypes = [
      { name: "Fallen Concrete Pillar", icon: "Square", severity: "CRITICAL" },
      { name: "Deep Mud / Sinkhole", icon: "Droplets", severity: "HIGH" },
      { name: "Collapsed Timber Roof", icon: "Layers", severity: "MODERATE" },
      { name: "Shattered Glass Field", icon: "AlertTriangle", severity: "LOW" }
    ];
    const picked = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    
    // Spawn near rover's current or forward vector
    const rx = Math.min(9, Math.max(0, roverState.position.x + (Math.random() > 0.5 ? 1 : -1)));
    const ry = Math.min(9, Math.max(0, roverState.position.y + (Math.random() > 0.5 ? 1 : -1)));
    const dist = (Math.random() * 4 + 1.5).toFixed(1);

    const newObs = {
      id: `obs-${Date.now()}`,
      type: picked.name,
      distance: parseFloat(dist),
      severity: picked.severity,
      status: "ACTIVE HAZARD",
      grid: { x: rx, y: ry },
      icon: picked.icon
    };

    setObstacles(prev => [newObs, ...prev]);
    addAlert(
      `Hazard Injected: ${picked.name}`,
      `New obstacle simulated at grid [${rx}, ${ry}] (~${dist}m ahead).`,
      picked.severity === 'CRITICAL' ? 'critical' : 'warning'
    );
    addLog('SIMULATION', 'warning', `Simulated hazard "${picked.name}" placed at [${rx}, ${ry}].`);
  }, [roverState.position, addAlert, addLog]);

  const simulateLowBattery = useCallback(() => {
    setRoverState(prev => ({
      ...prev,
      battery: 14.5
    }));
    addAlert('CRITICAL BATTERY LEVEL', 'Battery level depleted to 14.5%. Return to charging beacon advised.', 'critical');
    addLog('SIMULATION', 'critical', 'Simulated low battery fault injected (14.5%).');
  }, [addAlert, addLog]);

  const simulateWeakSignal = useCallback(() => {
    setRoverState(prev => ({
      ...prev,
      signalStrength: 18,
      connectionStatus: "Degraded",
      ping: 340
    }));
    addAlert('COMMUNICATION SIGNAL DEGRADED', 'RF Telemetry SNR at 18%. Packet loss detected.', 'warning');
    addLog('SIMULATION', 'warning', 'Simulated RF signal degradation injected (18%, 340ms latency).');
  }, [addAlert, addLog]);

  const simulateEmergency = useCallback(() => {
    setRoverState(prev => ({
      ...prev,
      temperature: 82.4,
      emergencyStop: true,
      speed: 0.0,
      connectionStatus: "Degraded"
    }));
    addAlert('CATASTROPHIC MOTOR OVERHEAT', 'Drive unit temperature at 82.4°C! Emergency auto-halt active.', 'critical');
    addLog('SIMULATION', 'critical', 'Thermal emergency simulation triggered (82.4°C). E-STOP active.');
  }, [addAlert, addLog]);

  const resetSimulation = useCallback(() => {
    setRoverState(INITIAL_ROVER_STATE);
    setObstacles(INITIAL_OBSTACLES);
    setDelivery(INITIAL_DELIVERY);
    setAlerts(INITIAL_ALERTS);
    setLogs(INITIAL_LOGS);
    addAlert('System Reset Complete', 'All rover telemetry, map coordinates, and alerts restored to factory preset.', 'normal');
    addLog('SYSTEM', 'info', 'Mission simulation reset to nominal initial parameters.');
  }, [addAlert, addLog]);

  // Autonomous roving AI tick
  useEffect(() => {
    if (roverState.mode !== 'Autonomous' || roverState.emergencyStop) return;

    const interval = setInterval(() => {
      setRoverState(prev => {
        if (prev.mode !== 'Autonomous' || prev.emergencyStop) return prev;
        
        const { x, y } = prev.position;
        const dest = prev.destination;

        // If at destination, halt
        if (x === dest.x && y === dest.y) {
          return { ...prev, speed: 0.0 };
        }

        // Simple intelligent step towards destination avoiding obstacles
        let nextX = x;
        let nextY = y;
        let heading = prev.heading;

        const deltaX = dest.x - x;
        const deltaY = dest.y - y;

        if (Math.abs(deltaX) >= Math.abs(deltaY) && deltaX !== 0) {
          nextX = deltaX > 0 ? x + 1 : x - 1;
          heading = deltaX > 0 ? 90 : 270;
        } else if (deltaY !== 0) {
          nextY = deltaY > 0 ? y + 1 : y - 1;
          heading = deltaY > 0 ? 180 : 0;
        }

        const newPos = { x: nextX, y: nextY };
        const newHistory = [...prev.pathHistory, newPos];
        const newSpeed = prev.targetSpeed > 0 ? prev.targetSpeed : 5.0;
        const newBattery = Math.max(5, prev.battery - 0.15);

        addLog('AUTO-NAV', 'info', `AI waypoint step: Rover advanced to [${nextX}, ${nextY}].`);
        updateDeliveryProgress(nextX, nextY);
        checkObstacleProximity(nextX, nextY, obstacles);

        if (nextX === dest.x && nextY === dest.y) {
          addAlert('Autonomous Mission Finished', 'Rover reached Target Sector [8, 8] safely.', 'normal');
          addLog('MISSION', 'success', 'Aid payload delivered via Autonomous Navigation!');
        }

        return {
          ...prev,
          position: newPos,
          heading,
          pathHistory: newHistory,
          speed: newSpeed,
          battery: parseFloat(newBattery.toFixed(1))
        };
      });
    }, 3800); // autonomous step every 3.8s

    return () => clearInterval(interval);
  }, [roverState.mode, roverState.emergencyStop, obstacles, addAlert, addLog, updateDeliveryProgress, checkObstacleProximity]);

  // Keyboard navigation listeners (WASD / Arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          moveRover('forward');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveRover('backward');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveRover('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveRover('right');
          break;
        case ' ': // Space for brake
          e.preventDefault();
          moveRover('stop');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveRover]);

  const value = {
    roverState,
    obstacles,
    dangerZones,
    delivery,
    alerts,
    logs,
    moveRover,
    setTargetSpeed,
    toggleMode,
    triggerEmergencyStop,
    simulateObstacle,
    simulateLowBattery,
    simulateWeakSignal,
    simulateEmergency,
    resetSimulation,
    dismissAlert,
    clearAlerts,
    addLog,
    addAlert
  };

  return (
    <RoverContext.Provider value={value}>
      {children}
    </RoverContext.Provider>
  );
};

export const useRover = () => {
  const context = useContext(RoverContext);
  if (!context) {
    throw new Error('useRover must be used within a RoverProvider');
  }
  return context;
};
