// src/components/AdminManagementCards.jsx
import React, { useState } from 'react';
import AddFacilityModal from './AddFacilityModal';

export default function AdminManagementCards({ 
  isDesktop = false, 
  registeredPlayers = [], 
  facilities = [], 
  onAddFacility = () => {}, 
  onToggleCoachingService = () => {}, 
  onToggleTenantService = () => {}
}) {
  const [activeListModal, setActiveListModal] = useState(null);
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);

  const safeFacilities = facilities || [];
  const safeRegisteredPlayers = registeredPlayers || [];

  const [coaches] = useState([
    { id: 'ch-1', name: 'Kier', mmr: 3450, status: 'Vetted Coach', rate: '₱500/hr', specialties: 'Advanced Strategy', facilityName: safeFacilities[0]?.name || 'Metro Pickleball Hub' },
    { id: 'ch-2', name: 'Chris', mmr: 3380, status: 'Vetted Coach', rate: '₱450/hr', specialties: 'Drills & Footwork', facilityName: safeFacilities[1]?.name || 'Laguna Sports & Pickle Complex' },
  ]);

  const [tenants] = useState([
    { id: 'tn-1', name: 'Smash & Pickle Pro Shop', category: 'Retail & Equipment Rentals', status: 'Active Tenant', facilityName: safeFacilities[0]?.name || 'Metro Pickleball Hub' },
    { id: 'tn-2', name: 'Hydrate Sports Bar', category: 'Food & Beverage', status: 'Active Tenant', facilityName: safeFacilities[2]?.name || 'Santa Rosa Indoor Arena' },
  ]);

  const cards = [
    { id: 'players', title: 'Active Players', icon: '👥', badge: `${safeRegisteredPlayers.length + 1} Active` },
    { id: 'facilities', title: 'Facilities', icon: '🏟️', badge: `${safeFacilities.length} Facilities` },
    { id: 'tenants', title: 'Tenants / Stores', icon: '🏪', badge: `${tenants.length} Active` },
    { id: 'coaches', title: 'Coaches', icon: '🎾', badge: `${coaches.length} Vetted` },
  ];

  return (
    <>
      {/* 4 Interactive Choice Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : '1fr 1fr', gap: '12px' }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => setActiveListModal(card.id)}
            style={{
              backgroundColor: '#ffffff', borderRadius: '20px', padding: isDesktop ? '20px' : '16px',
              border: '1px solid #DBE64C', height: isDesktop ? '140px' : '110px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              cursor: 'pointer', position: 'relative', boxShadow: '0 2px 8px rgba(0,31,63,0.08)'
            }}
          >
            <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '10px', fontWeight: '900', padding: '3px 8px', borderRadius: '6px' }}>
              {card.badge}
            </span>
            <div style={{ fontSize: isDesktop ? '32px' : '26px' }}>{card.icon}</div>
            <h3 style={{ margin: 0, fontSize: isDesktop ? '16px' : '14px', fontWeight: '800', color: '#001F3F' }}>
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Itemized Lists Modal Overlay */}
      {activeListModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 31, 63, 0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '16px', zIndex: 120
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px',
            width: '100%', maxWidth: isDesktop ? '620px' : '420px', maxHeight: '85vh',
            display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '2px solid #DBE64C'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>
                {cards.find(c => c.id === activeListModal)?.title}
              </h3>
              <button
                onClick={() => setActiveListModal(null)}
                style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}
              >
                ✕
              </button>
            </div>

            {activeListModal === 'facilities' && (
              <button
                onClick={() => setIsAddFacilityOpen(true)}
                style={{ width: '100%', backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '12px 0', fontSize: '13px', fontWeight: '900', cursor: 'pointer', marginBottom: '16px' }}
              >
                + Add New Facility
              </button>
            )}

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* FACILITIES LIST */}
              {activeListModal === 'facilities' && (
                safeFacilities.map(facility => (
                  <div key={facility.id} style={{ padding: '14px 16px', backgroundColor: '#F6F7ED', borderRadius: '16px', border: '1px solid #1E488F', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#001F3F' }}>{facility.name}</h4>
                      <span style={{ fontSize: '11px', color: '#1E488F', fontWeight: '600' }}>📍 {facility.location} • {facility.courtCount || 4} Courts</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid #DBE64C' }}>
                      <button
                        onClick={() => onToggleCoachingService(facility.id)}
                        style={{
                          backgroundColor: facility.allowCoaching ? '#001F3F' : '#1E488F',
                          color: facility.allowCoaching ? '#DBE64C' : '#ffffff',
                          border: 'none', borderRadius: '10px', padding: '8px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer'
                        }}
                      >
                        🎾 Coaches: {facility.allowCoaching ? 'ON' : 'OFF'}
                      </button>

                      <button
                        onClick={() => onToggleTenantService(facility.id)}
                        style={{
                          backgroundColor: facility.allowTenants ? '#001F3F' : '#1E488F',
                          color: facility.allowTenants ? '#DBE64C' : '#ffffff',
                          border: 'none', borderRadius: '10px', padding: '8px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer'
                        }}
                      >
                        🏪 Stores: {facility.allowTenants ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* TENANTS / STORES */}
              {activeListModal === 'tenants' && (
                tenants.map(tenant => (
                  <div key={tenant.id} style={{ padding: '14px 16px', backgroundColor: '#F6F7ED', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #1E488F' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#001F3F' }}>{tenant.name}</h4>
                      <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '10px', fontWeight: '900', padding: '3px 8px', borderRadius: '9999px' }}>{tenant.status}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#00804C' }}>📍 {tenant.facilityName}</span>
                  </div>
                ))
              )}

              {/* COACHES */}
              {activeListModal === 'coaches' && (
                coaches.map(coach => (
                  <div key={coach.id} style={{ padding: '14px 16px', backgroundColor: '#F6F7ED', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid #1E488F' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#001F3F' }}>Coach {coach.name}</h4>
                      <span style={{ backgroundColor: '#00804C', color: '#ffffff', fontSize: '10px', fontWeight: '900', padding: '3px 8px', borderRadius: '9999px' }}>{coach.mmr} MMR</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E488F' }}>🏟️ {coach.facilityName}</span>
                  </div>
                ))
              )}

              {/* PLAYERS */}
              {activeListModal === 'players' && (
                ['Tickler (You)', ...safeRegisteredPlayers].map((player, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', backgroundColor: '#F6F7ED', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #1E488F' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{player}</h4>
                    <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '4px 10px', borderRadius: '9999px' }}>3200+ MMR</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <AddFacilityModal
        isOpen={isAddFacilityOpen}
        onClose={() => setIsAddFacilityOpen(false)}
        onAddFacility={onAddFacility}
        isDesktop={isDesktop}
      />
    </>
  );
}