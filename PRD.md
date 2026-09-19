# Product Requirements Document (PRD)

## Project: Smart Disaster Response Rover Dashboard ("ReadyRadar")

---

### 1. Document Overview
* **Product Name**: Smart Disaster Response Rover Dashboard (ReadyRadar)
* **Target System**: Autonomous & Remote-Piloted Urban Search & Rescue (USAR) Ground Vehicle ("Rescue Rover-01")
* **Version**: 1.0.0
* **Status**: Approved & Active Implementation
* **Primary Objective**: Provide incident commanders and disaster response field operators with real-time situational awareness, dynamic environmental hazard mapping, telemetry health indicators, autonomous vs. manual path control, vital emergency aid delivery tracking, and rapid disaster scenario simulation.

---

### 2. Problem Statement
In post-disaster scenarios (earthquakes, structural collapses, floods, chemical contamination zones), human first responders face extreme danger. Deploying unmanned autonomous ground vehicles (UGVs) minimizes personnel risk, but operators require an intuitive, lag-free mission control interface that combines:
1. Instantaneous telemetry readings (battery reserve, core thermals, RF link quality, velocity).
2. Spatial obstacle detection with severity ratings (fallen concrete, flooded fissures, debris, structural voids).
3. Live tactical zone mapping with dynamic waypoint routing and real-time rover coordinate tracking.
4. Fail-safe manual overrides with emergency kill-switch (E-STOP) capabilities.
5. Critical emergency payload logistics tracking for first-aid supplies and vital survivor rescue kits.

---

### 3. Target User Personas
* **Incident Commander (Tactical Ops)**: Needs high-level status visibility, mission alerts, live timeline logs, and delivery confirmation of medical/survival supplies.
* **Rover Pilot / Field Operator**: Needs granular directional controls, throttle adjustment, autonomous path toggles, obstacle distance telemetry, and instant hazard alerts.
* **Emergency Response Engineer**: Needs simulation tools to test sensor fail-safes, weak signal handling, thermal thresholds, and disaster recovery workflows.

---

### 4. Functional Specifications

#### 4.1 Header & Mission HUD
* **Project & Rover Identifier**: Displays "Smart Disaster Response" and vehicle designation "Rescue Rover-01".
* **Connection Health Pill**: Live ping indicator (Online / 98ms ping / Low Latency RF).
* **Mission Clock**: Synchronized live digital UTC/local clock with mission elapsed timer.
* **Emergency Stop (E-STOP)**: Prominent tactical red button that immediately halts rover movement, triggers a critical alert, and flashes emergency hazard beacons.

#### 4.2 Rover Telemetry Cards
* **Battery Level**: Percentage display (0-100%) with color gradation (Green >50%, Amber 20-50%, Red <20%), charging indicator, and estimated remaining runtime.
* **Thermal Core**: Operating temperature (°C) with thermal warning threshold (>70°C).
* **Signal Strength**: RF telemetry strength in dBm / percentage with antenna link status.
* **Speed / Velocity**: Real-time velocity gauge (0.0 to 15.0 km/h) responsive to motor throttle.
* **Operating Mode**: Toggle state between **Autonomous AI Pathfinding** and **Manual Operator Control**.
* **Link Status**: Active connection status with packet transmission pulse.

#### 4.3 Interactive Disaster-Zone Map
* **Tactical Grid Canvas**: Visual representation of a 10x10 hazard sector including:
  - **Start Base Station** (Sector Origin)
  - **Emergency Destination Point** (Medical drop-off / Target sector)
  - **Active Rover Coordinate Position** (Pulsing tactical marker with heading angle)
  - **Dynamic Breadcrumb Trail** (Historical route traveled)
  - **Projected Safe Path** (Optimized navigation corridor)
  - **Hazard Zones** (Flooded areas, structural collapse sectors, radiation/toxic hot zones)
  - **Detected Obstacles** (Fallen pillars, rubble, water blocks)
* **Live Movement Engine**: Rover icon updates coordinates (X, Y) dynamically when directional commands or autonomous paths are executed, preventing out-of-bounds movement and alerting on obstacle proximity.

#### 4.4 Rover Directional Control Station
* **D-Pad Directional Controls**: Forward, Reverse, Pivot Left, Pivot Right, Immediate Brake.
* **Keyboard Shortcut Interactivity**: Support for `W`, `A`, `S`, `D` and Arrow keys.
* **Speed Throttle Slider**: Adjustable target speed from 0 to 15 km/h.
* **Autonomous / Manual Selector Switch**: Switch between automated algorithmic navigation and manual joystick/pad override.

#### 4.5 Hazard & Obstacle Detection Subsystem
* **LiDAR / Sonar Scanned Obstacles**:
  - Obstacle Type (e.g., Fallen Concrete Block, Submerged Ground, Broken Asphalt, Unstable Debris).
  - Proximity Distance (meters).
  - Severity Level (`CRITICAL`, `HIGH`, `MODERATE`, `LOW`).
  - Clearance Status (`ACTIVE_HAZARD`, `BYPASSED`, `CLEARED`).

#### 4.6 Emergency Alert Center
* **Priority-Categorized Notifications**:
  - `CRITICAL` (Red - e.g., Collision Proximity, E-Stop Active, Battery Critical, High Thermal Overheat).
  - `WARNING` (Amber - e.g., Signal Attenuation, Rough Terrain Resistance, Rerouting).
  - `INFO` (Blue/Green - e.g., Waypoint Reached, System Health Nominal, Mode Shifted).
* **Interactive Actions**: Dismiss alert, Acknowledge alert, Clear non-critical queue.

#### 4.7 Emergency Payload & Delivery Logistics
* **Package Information**: Unique Dispatch ID (e.g., `#MED-AID-8042`), Cargo Contents (Trauma Kit, Oxygen Canister, Emergency Beacon).
* **Delivery Destination**: Sector Coordinates & Target Marker.
* **Status**: Dispatched / In-Transit / Approaching Target / Delivered.
* **Progress Bar**: Real-time percentage towards target sector calculated from distance.

#### 4.8 Mission Activity Timeline Log
* **Chronological Event Stream**: Real-time log entries with timestamp, event tag, and description.
* **Filtered Events**: Movement actions, telemetry threshold breaches, obstacle scans, simulation injections.
* **Export / Clear Utility**: Option to clear or review log history.

#### 4.9 Scenario Simulation Engine
* **Instant Disaster Injections**:
  1. *Simulate Obstacle*: Spawns immediate hazard in rover's forward path.
  2. *Simulate Low Battery*: Drains battery to 14%, triggering power-saving protocol.
  3. *Simulate Weak Signal*: Attenuates signal to 22%, triggering RF warning.
  4. *Simulate Overheat / Emergency*: Escalates temperature to 84°C and sounds critical alarms.
  5. *Deliver Aid*: Advances rover to destination and completes mission.
  6. *Reset Simulation*: Restores default nominal state and telemetry.

---

### 5. Technical Architecture & Constraints
* **Framework**: React 18+ (Functional Components & Hooks: `useContext`, `useReducer`/`useState`, `useEffect`, `useCallback`, `useRef`).
* **Bundler & Tooling**: Vite 5+.
* **Language**: Vanilla JavaScript (ES6+ Modules, Clean JSX, No TypeScript required).
* **State Management**: React Context API (`RoverContext`) for centralized, predictable state dispatch.
* **Styling Architecture**: Pure Modern CSS with custom design tokens, dark tactical HUD theme, glassmorphism overlays, CSS grid layouts, and CSS keyframe animations.
* **Icons**: `lucide-react` modern minimalist tactical icon set.
* **Performance**: Lightweight zero-backend client execution, optimized re-renders, 60fps animations.

---

### 6. Non-Functional Requirements
* **Responsiveness**: Flawless visual hierarchy across Desktop (1440px+), Laptop (1024px), Tablet (768px), and Mobile (375px+).
* **Accessibility**: Keyboard navigable controls, high-contrast visual indicators (WCAG AA compliant contrast on dark surfaces).
* **User Feedback**: Immediate visual acknowledgment for every click, slider change, and keyboard stroke.
