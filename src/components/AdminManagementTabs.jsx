// src/components/AdminManagementCards.jsx
import React, { useState } from 'react';

export default function AdminManagementCards({ isDesktop, registeredPlayers, courts, inventory, setActiveModal }) {
  const [activeListModal, setActiveListModal] = useState(null);

  const openCourtsCount = courts.filter(c => c.open && !c.isPending).length;

  const [coaches] = useState([
    { id: 'ch-1', name: 'Kier', mmr: 3450, status: 'Vetted Coach', rate: '₱500/hr', specialties: 'Advanced Strategy & Serves' },
    { id: 'ch-2', name: 'Chris', mmr: 3380, status: 'Vetted Coach', rate: '₱450/hr', specialties: 'Drills & Footwork' },
  ]);

  const [tenants] = useState([
    { id: 'tn-1', name: 'Smash & Pickle Pro Shop', location: 'Court 1 Lobby', category: 'Retail & Equipment', status: 'Active Tenant' },
    { id: 'tn-2', name: 'Hydrate Sports Bar', location: 'Main Pavilion', category: 'Food & Beverage', status: 'Active Tenant' },
  ]);

  const cards = [
    { id: 'players', title: 'Active Players', icon: '👥', badge: `${registeredPlayers.length + 1} Active` },
    { id: 'facilities', title: 'Facilities', icon: '🏟️', badge: `${openCourtsCount} Open` },
    { id: 'tenants', title: 'Tenants / Stores', icon: '🏪', badge: `${tenants.length} Active` },
    { id: 'coaches', title: 'Coaches', icon: '🎾', badge: `${coaches.length} Vetted` },
  ];

  return (
    <>
      {/* 4 Interactive Grid Choice Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : '1fr 1fr',
        gap: '12px'
      }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => {
              if (card.id === 'facilities') {
                setActiveModal('courts');
              } else {
                setActiveListModal(card.id);
              }
            }}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: isDesktop ? '20px' : '16px',
              border: '1px solid #e2e8f0',
              height: isDesktop ? '140px' : '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,31,63,0.05)'
            }}
          >
            <span style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#DBE64C',
              color: '#001F3F',
              fontSize: '10px',
              fontWeight: '900',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              {card.badge}
            </span>
            <div style={{ fontSize: isDesktop ? '32px' : '26px' }}>{card.icon}</div>
            <h3 style={{ margin: 0, fontSize: isDesktop ? '16px' : '14px', fontWeight: '800', color: '#001F3F' }}>
              {card.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal Popup Overlay for Itemized Lists */}
      {activeListModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 31, 63, 0.85)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '16px', zIndex: 120
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: isDesktop ? '32px' : '20px',
            width: '100%',
            maxWidth: isDesktop ? '580px' : '380px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>
                {cards.find(c => c.id === activeListModal)?.title}
              </h3>
              <button
                onClick={() => setActiveListModal(null)}
                style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeListModal === 'players' && (
                ['Tickler (You)', ...registeredPlayers].map((player, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', backgroundColor: '#F6F7ED', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#001F3F', overflow: 'hidden' }}>
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.split(' ')[0]}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{player}</h4>
                        <span style={{ fontSize: '11px', color: '#1E488F' }}>Active Member</span>
                      </div>
                    </div>
                    <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '4px 10px', borderRadius: '9999px' }}>3200+ MMR</span>
                  </div>
                ))
              )}

              {activeListModal === 'tenants' && (
                tenants.map(tenant => (
                  <div key={tenant.id} style={{ padding: '12px 16px', backgroundColor: '#F6F7ED', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{tenant.name}</h4>
                      <span style={{ fontSize: '11px', color: '#1E488F' }}>{tenant.category} • {tenant.location}</span>
                    </div>
                    <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '4px 10px', borderRadius: '9999px' }}>{tenant.status}</span>
                  </div>
                ))
              )}

              {activeListModal === 'coaches' && (
                coaches.map(coach => (
                  <div key={coach.id} style={{ padding: '12px 16px', backgroundColor: '#F6F7ED', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#001F3F', overflow: 'hidden' }}>
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${coach.name}`} alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Coach {coach.name}</h4>
                        <span style={{ fontSize: '11px', color: '#1E488F' }}>{coach.specialties} • {coach.rate}</span>
                      </div>
                    </div>
                    <span style={{ backgroundColor: '#00804C', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '4px 10px', borderRadius: '9999px' }}>{coach.mmr} MMR</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}