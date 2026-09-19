// Initial data and mock presets for Rescue Rover-01

export const INITIAL_ROVER_STATE = {
  name: "Rescue Rover-01",
  codeName: "VANGUARD-USAR",
  connectionStatus: "Connected", // Connected | Degraded | Disconnected
  ping: 42, // ms
  battery: 88, // %
  batteryCharging: false,
  temperature: 34.2, // Celsius
  signalStrength: 94, // %
  speed: 0.0, // km/h
  targetSpeed: 6.5, // km/h (speed slider setting)
  mode: "Autonomous", // Autonomous | Manual
  emergencyStop: false,
  heading: 90, // Degrees: 0 (N), 90 (E), 180 (S), 270 (W)
  position: { x: 1, y: 1 }, // 0 to 9 on a 10x10 tactical grid
  startPosition: { x: 1, y: 1 },
  destination: { x: 8, y: 8 },
  pathHistory: [
    { x: 1, y: 1 }
  ]
};

export const INITIAL_OBSTACLES = [
  {
    id: "obs-1",
    type: "Fallen Concrete Block",
    distance: 4.2, // meters
    severity: "CRITICAL", // CRITICAL | HIGH | MODERATE | LOW
    status: "ACTIVE HAZARD", // ACTIVE HAZARD | BYPASSED | CLEARED
    grid: { x: 4, y: 3 },
    icon: "Square"
  },
  {
    id: "obs-2",
    type: "Broken Road Fissure",
    distance: 8.7,
    severity: "HIGH",
    status: "ACTIVE HAZARD",
    grid: { x: 6, y: 5 },
    icon: "AlertTriangle"
  },
  {
    id: "obs-3",
    type: "Submerged Water Area",
    distance: 12.1,
    severity: "MODERATE",
    status: "ACTIVE HAZARD",
    grid: { x: 3, y: 7 },
    icon: "Droplets"
  },
  {
    id: "obs-4",
    type: "Structural Steel Debris",
    distance: 15.4,
    severity: "HIGH",
    status: "ACTIVE HAZARD",
    grid: { x: 7, y: 2 },
    icon: "Layers"
  },
  {
    id: "obs-5",
    type: "High Step / Rubble Crest",
    distance: 19.8,
    severity: "LOW",
    status: "BYPASSED",
    grid: { x: 2, y: 5 },
    icon: "Mountain"
  }
];

export const DANGER_ZONES = [
  {
    id: "dz-1",
    name: "Structural Collapse Zone",
    type: "collapse",
    cells: [
      { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 3 }
    ],
    riskLevel: "CRITICAL"
  },
  {
    id: "dz-2",
    name: "Deep Flood Basin",
    type: "flood",
    cells: [
      { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 3, y: 8 }, { x: 4, y: 8 }
    ],
    riskLevel: "HIGH"
  },
  {
    id: "dz-3",
    name: "Toxic Gas Cloud / Hot Zone",
    type: "toxic",
    cells: [
      { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 6 }, { x: 8, y: 6 }
    ],
    riskLevel: "CRITICAL"
  }
];

export const INITIAL_DELIVERY = {
  packageId: "AID-PKG-8849",
  cargoName: "Emergency Trauma Kit & Satellite Transceiver",
  weight: "4.8 kg",
  destinationName: "Sector 8-Echo (Collapsed Mall Void)",
  destinationCoords: "Grid [8, 8]",
  status: "In Transit", // In Transit | Approaching Target | Delivered | Pending
  progress: 25, // %
  estimatedDistance: "48.5 m",
  eta: "3 min 40 sec"
};

export const INITIAL_ALERTS = [
  {
    id: "alt-1",
    timestamp: "13:48:12",
    title: "Obstacle Detected Ahead",
    message: "Fallen concrete block detected 4.2m along primary traversal vector.",
    level: "warning", // normal | warning | critical
    read: false
  },
  {
    id: "alt-2",
    timestamp: "13:45:00",
    title: "Autonomous Navigation Initialized",
    message: "Safe route projected through corridor Alpha-3.",
    level: "normal",
    read: true
  },
  {
    id: "alt-3",
    timestamp: "13:42:30",
    title: "LIDAR Subsystem Calibrated",
    message: "360-degree point-cloud scanner operational.",
    level: "normal",
    read: true
  }
];

export const INITIAL_LOGS = [
  {
    id: "log-1",
    timestamp: "13:48:12",
    tag: "OBSTACLE",
    type: "warning",
    message: "LiDAR detected 'Fallen Concrete Block' at distance 4.2m."
  },
  {
    id: "log-2",
    timestamp: "13:46:50",
    tag: "ROUTING",
    type: "info",
    message: "Autonomous path recalculated to avoid Zone-2 flood hazard."
  },
  {
    id: "log-3",
    timestamp: "13:45:00",
    tag: "MODE",
    type: "success",
    message: "Autonomous mode enabled by Tactical Command."
  },
  {
    id: "log-4",
    timestamp: "13:42:15",
    tag: "PAYLOAD",
    type: "info",
    message: "Package #AID-PKG-8849 locked onto payload bay. Mission started."
  },
  {
    id: "log-5",
    timestamp: "13:40:00",
    tag: "SYSTEM",
    type: "info",
    message: "Rescue Rover-01 system boot completed. All sensors nominal."
  }
];
