import React, { useState } from 'react';
import { RoverProvider } from './context/RoverContext';
import { Header } from './components/Header/Header';
import { GisCommandMap } from './components/GisMap/GisCommandMap';
import { StatusCards } from './components/StatusCards/StatusCards';
import { DisasterMap } from './components/Map/DisasterMap';
import { ControlPanel } from './components/Controls/ControlPanel';
import { ObstacleList } from './components/Obstacles/ObstacleList';
import { EmergencyAlerts } from './components/Alerts/EmergencyAlerts';
import { DeliveryStatus } from './components/Delivery/DeliveryStatus';
import { ActivityLog } from './components/Activity/ActivityLog';
import { SimulationPanel } from './components/Controls/SimulationPanel';
import './styles/index.css';
import './styles/dashboard.css';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="app-container">
      {/* 1. Header HUD with Segmented Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="dashboard-wrapper">
        {/* VIEW 1: Overview - Full GIS Satellite Command Map (Matching Screenshot) */}
        {activeTab === 'overview' && (
          <>
            <GisCommandMap />
            {/* Status Telemetry Overview below GIS Map */}
            <StatusCards />
          </>
        )}

        {/* VIEW 2: Real-Time Activity & Pilot Controls */}
        {activeTab === 'telemetry' && (
          <>
            <StatusCards />
            <div className="main-dashboard-grid">
              <DisasterMap />
              <ControlPanel />
            </div>
            <div className="secondary-dashboard-grid">
              <ObstacleList />
              <EmergencyAlerts />
              <ActivityLog />
            </div>
          </>
        )}

        {/* VIEW 3: Prediction & Hazards */}
        {activeTab === 'hazards' && (
          <>
            <div className="main-dashboard-grid">
              <DisasterMap />
              <ObstacleList />
            </div>
            <EmergencyAlerts />
          </>
        )}

        {/* VIEW 4: Logistics & Delivery */}
        {activeTab === 'delivery' && (
          <>
            <div className="main-dashboard-grid">
              <DeliveryStatus />
              <ActivityLog />
            </div>
            <StatusCards />
          </>
        )}

        {/* VIEW 5: Simulation Sandbox */}
        {activeTab === 'simulation' && (
          <>
            <SimulationPanel />
            <div className="main-dashboard-grid" style={{ marginTop: '1.5rem' }}>
              <DisasterMap />
              <ControlPanel />
            </div>
          </>
        )}

        {/* Always visible quick simulation drawer at bottom of overview */}
        {activeTab === 'overview' && (
          <SimulationPanel />
        )}

        {/* Tactical Footer */}
        <footer className="dashboard-footer">
          <div>
            <span>ReadyRadar GIS Mission Control v1.2.0</span>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <span>Seismic & USAR Fault Zone Command: Rescue Rover-01</span>
          </div>
          <div className="footer-tags">
            <span className="footer-badge">SEISMIC SENSORS: 12 ACTIVE</span>
            <span className="footer-badge">GIS TOPOGRAPHY: 8K RESOLUTION</span>
            <span className="footer-badge" style={{ color: 'var(--accent-emerald)' }}>TELEMETRY: ACTIVE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RoverProvider>
      <DashboardContent />
    </RoverProvider>
  );
}
