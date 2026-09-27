// src/components/AddFacilityModal.jsx
import React, { useState } from 'react';

const PHILIPPINE_LOCATIONS = [
  'Metro Manila', 'Calamba, Laguna', 'Santa Rosa, Laguna', 'Cebu City',
  'Davao City', 'Angeles, Pampanga', 'Iloilo City', 'Baguio City', 'Cagayan de Oro'
];

export default function AddFacilityModal({ isOpen, onClose, onAddFacility, isDesktop }) {
  const [facilityName, setFacilityName] = useState('');
  const [location, setLocation] = useState(PHILIPPINE_LOCATIONS[0]);
  const [allowCoaching, setAllowCoaching] = useState(true);
  const [allowTenants, setAllowTenants] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!facilityName.trim()) return;

    onAddFacility({
      id: `fac-${Date.now()}`,
      name: facilityName.trim(),
      location: location,
      courtCount: 4,
      allowCoaching: allowCoaching,
      allowTenants: allowTenants,
      status: 'Active'
    });

    setFacilityName('');
    setLocation(PHILIPPINE_LOCATIONS[0]);
    setAllowCoaching(true);
    setAllowTenants(true);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 31, 63, 0.88)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '16px', zIndex: 130
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px',
        width: '100%', maxWidth: isDesktop ? '520px' : '380px', boxSizing: 'border-box',
        border: '2px solid #DBE64C'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: isDesktop ? '20px' : '18px', fontWeight: '800', color: '#001F3F' }}>
            + Register New Facility
          </h3>
          <button onClick={onClose} type="button" style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '6px' }}>FACILITY NAME</label>
            <input
              type="text"
              placeholder="e.g. Metro Pickleball Hub"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '14px', boxSizing: 'border-box', color: '#001F3F' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '6px' }}>PHILIPPINES LOCATION</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '14px', boxSizing: 'border-box', color: '#001F3F' }}
            >
              {PHILIPPINE_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Service Toggles */}
          <div style={{ backgroundColor: '#F6F7ED', padding: '16px', borderRadius: '16px', border: '1px solid #DBE64C', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#001F3F' }}>Coaching Services</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#1E488F' }}>Allow vetted coaches to offer paid lessons</p>
              </div>
              <input
                type="checkbox"
                checked={allowCoaching}
                onChange={(e) => setAllowCoaching(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#00804C', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#001F3F' }}>Tenants / Pro Shops</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#1E488F' }}>Allow vendors & rental pro shops in facility</p>
              </div>
              <input
                type="checkbox"
                checked={allowTenants}
                onChange={(e) => setAllowTenants(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#00804C', cursor: 'pointer' }}
              />
            </div>
          </div>

          <button type="submit" style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', marginTop: '8px' }}>
            Save Facility
          </button>
        </form>
      </div>
    </div>
  );
}