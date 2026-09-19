# 🛰️ Smart Disaster Response Rover Dashboard (ReadyRadar)

A modern, tactical mission-control web dashboard built to monitor, control, and simulate an autonomous disaster-response rover (**Rescue Rover-01**) operating in hazardous environments such as collapsed buildings, flood-affected sectors, and high-risk emergency zones.

![Dashboard Preview](https://img.shields.io/badge/Status-Operational-10b981?style=for-the-badge) ![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react) ![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite) ![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌟 Key Features

### 1. 📡 Tactical Header HUD
- **Mission Identifiers**: Live designation for *Smart Disaster Response* & *Rescue Rover-01*.
- **Telemetry Beacon**: Real-time ping latency and connectivity link status (`Online`, `Degraded`, `Offline`).
- **Synchronized UTC Clock**: Real-time mission time and date stamp.
- **Emergency Stop (E-STOP)**: One-click motor kill-switch with tactile audio-visual hazard flash.

### 2. ⚡ Live Telemetry Status Cards
- **Power Reserve**: Real-time battery indicator with color-coded safety thresholds and runtime estimation.
- **Core Thermals**: Operating temperature monitoring with overheat alert threshold (`>70°C`).
- **RF Signal Link**: Telemetry signal strength (dBm & percentage) with packet loss detection.
- **Live Velocity**: Speedometer displaying speed in km/h relative to user throttle limit.
- **Navigation Mode**: Dynamic badge and card toggle for **Autonomous AI** vs. **Manual Pilot**.
- **Telemetry Link**: Primary high-frequency link status.

### 3. 🗺️ Interactive Disaster Sector Map
- **2D Tactical Grid**: 10x10 sector representation with coordinate tracking `[X, Y]`.
- **Dynamic Rover Marker**: Real-time position tracking with directional heading angle (North, East, South, West).
- **Hazard Zones**: Overlays for Structural Collapses, Deep Flood Basins, and Toxic Gas Hot Zones.
- **Projected Route & Breadcrumbs**: Displays historical path traveled and projected route to target.
- **Sector Inspector**: Hover over any sector grid cell to inspect coordinates.

### 4. 🕹️ Pilot Control Station
- **Directional D-Pad**: Intuitive Forward, Reverse, Left Pivot, Right Pivot, and Emergency Brake controls.
- **Keyboard Shortcut Support**: Full `WASD` and `Arrow Key` pilot navigation.
- **Motor Throttle Slider**: Real-time adjustment from 1.0 km/h (Precision) to 15.0 km/h (Sprint).
- **Autonomous vs. Manual Switch**: Seamless switch between AI pathfinding and manual remote operation.

### 5. 🎯 Obstacle & Hazard Sonar
- **Detected Hazards**: Real-time list of detected obstacles (e.g., *Fallen Concrete Block*, *Broken Road*, *Submerged Ground*, *Steel Debris*).
- **Hazard Telemetry**: Displays distance in meters, severity tier (`CRITICAL`, `HIGH`, `MODERATE`, `LOW`), and clearance status.

### 6. 🚨 Emergency Alerts Center
- **Categorized Priority Feed**: Real-time event notifications categorized into `CRITICAL`, `WARNING`, and `NORMAL`.
- **Interactive Management**: Dismiss individual alerts or clear non-critical log queue.

### 7. 📦 Aid Payload Logistics Tracker
- **Mission Payload Manifest**: Package ID (`#AID-PKG-8849`), cargo items, and payload weight.
- **Target Coordinates**: Destination waypoint with distance calculation and dynamic ETA countdown.
- **Progress Gauge**: Animated progress percentage that updates automatically as the rover navigates to the target.

### 8. 📜 Mission Activity Stream
- **Live Timeline**: Timestamped action audit log recording movement commands, obstacle alerts, throttle changes, and mode toggles.
- **Filter Tags**: Quickly filter logs by `ALL`, `NAV`, `HAZARD`, and `E-STOP`.

### 9. 🧪 Disaster Scenario Simulation Sandbox
- **Spawn Obstacle**: Injects an unexpected hazard directly into the rover's forward path.
- **Simulate Low Battery**: Drains power reserve to 14.5% to test low-power fail-safe protocols.
- **Simulate Jammed RF**: Attenuates RF signal link to 18% with increased latency.
- **Trigger Emergency**: Spawns thermal overheat (82.4°C) and activates automatic emergency stop.
- **Reset Mission**: Instantly restores nominal state and telemetry.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 (Functional Components, Custom Hooks, Context API)
- **Tooling & Bundling**: Vite 5
- **Languages**: JavaScript (ES6+ Modules, JSX), HTML5
- **Styling**: Pure Modern Vanilla CSS (CSS Grid, Flexbox, Glassmorphism, CSS Variables, Animations)
- **Icons**: `lucide-react`
- **Typography**: Google Fonts (*Inter*, *Rajdhani*, *JetBrains Mono*)

---

## 📂 Project Structure

```
ReadyRadar/
├── index.html                      # HTML5 Entry point with fonts and meta tags
├── package.json                    # Project scripts & dependencies
├── vite.config.js                  # Vite configuration
├── PRD.md                          # Comprehensive Product Requirements Document
├── README.md                       # Documentation & guide
├── public/
│   └── rover-icon.svg              # Mission rover SVG asset
└── src/
    ├── main.jsx                    # React root render
    ├── App.jsx                     # Top-level application container
    ├── context/
    │   └── RoverContext.jsx        # Central state, movement engine, autonomous AI & simulations
    ├── data/
    │   └── initialData.js          # Telemetry presets, obstacles, danger zones, payload data
    ├── components/
    │   ├── Header/
    │   │   └── Header.jsx          # Header HUD with UTC clock, status pill, E-STOP
    │   ├── StatusCards/
    │   │   ├── StatusCards.jsx     # Telemetry metric grid
    │   │   └── MetricCard.jsx      # Reusable gauge card
    │   ├── Map/
    │   │   ├── DisasterMap.jsx     # Interactive SVG tactical map
    │   │   └── MapLegend.jsx       # Map color/symbol key
    │   ├── Controls/
    │   │   ├── ControlPanel.jsx    # D-pad, keyboard navigation, throttle slider
    │   │   └── SimulationPanel.jsx # One-click disaster simulation triggers
    │   ├── Obstacles/
    │   │   └── ObstacleList.jsx    # Obstacle sonar listing
    │   ├── Alerts/
    │   │   └── EmergencyAlerts.jsx # Emergency alert center
    │   ├── Delivery/
    │   │   └── DeliveryStatus.jsx  # Aid payload delivery status
    │   └── Activity/
    │       └── ActivityLog.jsx     # Mission activity stream timeline
    └── styles/
        ├── index.css               # Design tokens, CSS variables, glassmorphism, animations
        └── dashboard.css           # Modular component styling & responsive breakpoints
```

---

## 🚀 How to Install and Run

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (Node Package Manager)

### Step 1: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to interact with the dashboard.

### Step 3: Build for Production
To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🎮 Keyboard Controls

| Key | Action |
| :--- | :--- |
| `W` or `↑` | Move Rover Forward |
| `S` or `↓` | Move Rover Backward (Reverse) |
| `A` or `←` | Pivot Rover 90° Left |
| `D` or `→` | Pivot Rover 90° Right |
| `Space` | Emergency Brake / Halt |

---

## 🔮 Future Improvements

1. **3D LiDAR Point-Cloud View**: Integrate Three.js / WebGL for 3D terrain reconstruction.
2. **Thermal Video Feed Simulation**: Real-time simulated infrared / FLIR camera stream.
3. **Multi-Rover Swarm Support**: Manage multiple rovers (*Rover-02*, *Drone-01*) from a single dashboard.
4. **Offline PWA Support**: Service workers for remote field deployment without internet connectivity.
5. **WebSocket / ROS Integration**: Connect to actual ROS (Robot Operating System) nodes via `rosbridge_websocket`.

---

## 📄 License
This project is open-source under the MIT License.
