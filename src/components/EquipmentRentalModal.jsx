// src/components/EquipmentRentalModal.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function EquipmentRentalModal({ onClose }) {
  const { inventory, rentItem } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [durationHours, setDurationHours] = useState(1);

  const filteredItems = selectedCategory === 'All' 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#f1f5f9',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '360px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
        border: '1px solid #cbd5e1'
      }}>
        
        {/* Header */}
        <div style={{ padding: '16px 16px 12px 16px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Equipments Rental</h3>
              <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>Pickleball paddles, balls & machines</p>
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
                justifyContent: 'center'
              }}
            >✕</button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ padding: '10px 16px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {['All', 'Paddles', 'Balls', 'Ball Machines'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: selectedCategory === cat ? '#0f172a' : '#f1f5f9',
                    color: selectedCategory === cat ? '#ffffff' : '#475569',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
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

        {/* Item List */}
        <div style={{ padding: '12px 16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredItems.map(item => {
            const totalPrice = item.baseRate * durationHours;
            const isUnavailable = item.isRented || item.isPending;

            return (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '12px',
                  border: '2px solid #0f172a',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  opacity: isUnavailable ? 0.65 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h4>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {item.brand}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'block' }}>
                      ₱{totalPrice}
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      ₱{item.baseRate}/hr
                    </span>
                  </div>
                </div>

                <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#64748b', fontWeight: '600' }}>
                  Condition: {item.condition}
                </p>

                <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: '#334155', lineHeight: '1.3' }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    backgroundColor: item.isPending ? '#fef3c7' : item.isRented ? '#fee2e2' : '#dcfce7', 
                    color: item.isPending ? '#92400e' : item.isRented ? '#991b1b' : '#166534', 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    padding: '2px 8px', 
                    borderRadius: '9999px' 
                  }}>
                    {item.isPending ? 'Rental Pending' : item.isRented ? 'Occupied' : 'Available'}
                  </span>

                  <button
                    onClick={() => rentItem(item.id, durationHours)}
                    disabled={isUnavailable}
                    style={{
                      backgroundColor: isUnavailable ? '#94a3b8' : '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '6px 14px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: isUnavailable ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {item.isPending ? 'Pending' : item.isRented ? 'Rented' : 'Rent Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
            Equipment inspected and sanitized daily
          </span>
        </div>

      </div>
    </div>
  );
}