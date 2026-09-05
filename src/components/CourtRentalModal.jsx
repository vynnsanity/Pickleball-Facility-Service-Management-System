// src/components/CourtRentalModal.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CourtRentalModal({ onClose }) {
  const { courts, bookCourt } = useApp();
  const [selectedType, setSelectedType] = useState('All');
  const [durationHours, setDurationHours] = useState(1);

  const filteredCourts = selectedType === 'All' 
    ? courts 
    : courts.filter(c => c.type === selectedType);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '32px',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#f1f5f9',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '360px',
        maxHeight: '92%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
        border: '1px solid #cbd5e1'
      }}>
        
        {/* Header */}
        <div style={{ padding: '16px 16px 12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Courts Reservation</h3>
              <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>Indoor & Outdoor Pickleball Courts</p>
            </div>
            <button 
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
              }}
            >✕</button>
          </div>
        </div>

        {/* Category Filters & Duration Dropdown */}
        <div style={{ padding: '10px 16px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {['All', 'Indoor', 'Outdoor'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    backgroundColor: selectedType === type ? '#0f172a' : '#f1f5f9',
                    color: selectedType === type ? '#ffffff' : '#475569',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Duration:</span>
            <select 
              value={durationHours} 
              onChange={(e) => setDurationHours(Number(e.target.value))}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#0f172a'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(hr => (
                <option key={hr} value={hr}>{hr} {hr === 1 ? 'hr' : 'hrs'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5 Court Item Cards */}
        <div style={{ padding: '12px 16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCourts.map(court => {
            const totalPrice = court.baseRate * durationHours;

            return (
              <div 
                key={court.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '12px',
                  border: '2px solid #0f172a',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  opacity: !court.open ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{court.name}</h4>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {court.type}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'block' }}>
                      ₱{totalPrice}
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      ₱{court.baseRate}/hr
                    </span>
                  </div>
                </div>

                <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#64748b', fontWeight: '600' }}>
                  Surface: {court.surface}
                </p>

                <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: '#334155', lineHeight: '1.3' }}>
                  {court.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    backgroundColor: !court.open ? '#fef3c7' : '#dcfce7', 
                    color: !court.open ? '#92400e' : '#166534', 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    padding: '2px 8px', 
                    borderRadius: '9999px' 
                  }}>
                    {!court.open ? 'Booking Pending' : 'Available'}
                  </span>

                  <button
                    onClick={() => bookCourt(court.id, durationHours)}
                    disabled={!court.open}
                    style={{
                      backgroundColor: !court.open ? '#94a3b8' : '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '6px 14px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: !court.open ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {!court.open ? 'Pending' : 'Book Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
            Courts resurfaced and maintained daily
          </span>
        </div>

      </div>
    </div>
  );
}