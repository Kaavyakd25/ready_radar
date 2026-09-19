import React from 'react';
import { useRover } from '../../context/RoverContext';
import {
  PackageCheck,
  Package,
  MapPin,
  Clock,
  Navigation2,
  CheckCircle2
} from 'lucide-react';

export const DeliveryStatus = () => {
  const { delivery, roverState } = useRover();
  const isDelivered = delivery.status === 'Delivered';

  return (
    <div className="dashboard-card delivery-card">
      <div className="card-header">
        <div className="card-title">
          <PackageCheck size={18} />
          <span>Aid Payload Logistics</span>
        </div>
        <div
          className={`delivery-status-badge ${isDelivered ? 'delivered' : 'in-transit'}`}
        >
          {delivery.status}
        </div>
      </div>

      <div className="delivery-details">
        {/* Package ID & Cargo */}
        <div className="delivery-row">
          <span className="delivery-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Package size={15} style={{ color: 'var(--accent-cyan)' }} />
            Payload Manifest:
          </span>
          <span className="delivery-val" style={{ color: 'var(--accent-cyan)' }}>
            {delivery.packageId}
          </span>
        </div>

        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '-0.3rem', paddingLeft: '1.4rem' }}>
          {delivery.cargoName} ({delivery.weight})
        </div>

        {/* Target Destination */}
        <div className="delivery-row">
          <span className="delivery-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} style={{ color: 'var(--accent-amber)' }} />
            Target Sector:
          </span>
          <span className="delivery-val">{delivery.destinationCoords}</span>
        </div>

        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '-0.3rem', paddingLeft: '1.4rem' }}>
          {delivery.destinationName}
        </div>

        {/* Estimated Distance & ETA */}
        <div className="delivery-row">
          <span className="delivery-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Navigation2 size={15} style={{ color: 'var(--accent-emerald)' }} />
            Distance to Target:
          </span>
          <span className="delivery-val">
            {isDelivered ? '0.0 m (At Target)' : delivery.estimatedDistance}
          </span>
        </div>

        <div className="delivery-row">
          <span className="delivery-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={15} style={{ color: 'var(--text-cyan)' }} />
            Estimated Arrival (ETA):
          </span>
          <span className="delivery-val">
            {isDelivered ? 'Delivered' : delivery.eta}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span>Mission Progress</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isDelivered ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
              {delivery.progress}%
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${delivery.progress}%`,
                background: isDelivered ? 'var(--grad-emerald)' : 'var(--grad-cyan-blue)'
              }}
            />
          </div>
        </div>

        {isDelivered && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            color: 'var(--text-emerald)',
            marginTop: '0.3rem'
          }}>
            <CheckCircle2 size={16} />
            <span><b>MISSION ACCOMPLISHED:</b> Emergency medical kit deployed to survivors!</span>
          </div>
        )}
      </div>
    </div>
  );
};
