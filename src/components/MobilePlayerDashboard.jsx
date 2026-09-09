// src/components/MobilePlayerDashboard.jsx
import React from 'react';

export default function MobilePlayerDashboard({ 
  profile, 
  matchHistory, 
  inventory, 
  courts, 
  equipments, 
  isQueuing, 
  queueTime, 
  formatTimer, 
  activeMatch, 
  setActiveModal, 
  setMatchFoundModal, 
  cancelQueue, 
  pendingNotifsCount, 
  toggleRole, 
  currentRole 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Profile Header Card */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '20px', 
        padding: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        border: '1px solid #DBE64C' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#001F3F', overflow: 'hidden' }}>
            <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>{profile.fullName}</h2>
            <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '2px 10px', borderRadius: '9999px' }}>
              {profile.mmr} MMR
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={toggleRole} 
            style={{ backgroundColor: '#001F3F', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
          >
            {currentRole}
          </button>
          <button 
            onClick={() => setActiveModal('notifications')} 
            style={{ position: 'relative', backgroundColor: '#001F3F', color: '#ffffff', border: 'none', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer' }}
          >
            🔔
            {pendingNotifsCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '900', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Membership Status Card */}
      <div style={{ backgroundColor: '#001F3F', borderRadius: '20px', padding: '18px 20px', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Membership:</h3>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#DBE64C' }}>{profile.isMember ? 'Active' : 'Inactive'}</span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#F6F7ED', opacity: 0.8 }}>Expires in: {profile.membershipExpiry}</p>
      </div>

      {/* RESTORED: 3. Equipments & Courts Quick Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div 
          onClick={() => setActiveModal('inventory')} 
          style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '20px', 
            padding: '16px', 
            border: '1px solid #e2e8f0', 
            height: '120px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            cursor: 'pointer', 
            position: 'relative' 
          }}
        >
          <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '10px', fontWeight: '900', padding: '3px 8px', borderRadius: '6px' }}>
            {equipments} Free
          </span>
          <div style={{ fontSize: '28px' }}>🏓</div>
          <div><h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Equipments</h3></div>
        </div>

        <div 
          onClick={() => setActiveModal('courts')} 
          style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '20px', 
            padding: '16px', 
            border: '1px solid #e2e8f0', 
            height: '120px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            cursor: 'pointer', 
            position: 'relative' 
          }}
        >
          <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '10px', fontWeight: '900', padding: '3px 8px', borderRadius: '6px' }}>
            {courts.filter(c => c.open && !c.isPending).length} Open
          </span>
          <div style={{ fontSize: '28px' }}>🏟️</div>
          <div><h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Courts</h3></div>
        </div>
      </div>

      {/* 4. Match Queue CTA */}
      <div>
        {activeMatch ? (
          <button 
            onClick={() => setMatchFoundModal(activeMatch)} 
            style={{ 
              width: '100%', backgroundColor: '#001F3F', color: '#DBE64C', border: '2px solid #DBE64C', 
              borderRadius: '20px', padding: '16px 0', fontSize: '16px', fontWeight: '900', cursor: 'pointer' 
            }}
          >
            IN MATCH ({activeMatch.courtName.toUpperCase()})
          </button>
        ) : !isQueuing ? (
          <button 
            onClick={() => setActiveModal('matchmaking')} 
            style={{ 
              width: '100%', backgroundColor: '#00804C', color: '#ffffff', border: 'none', 
              borderRadius: '20px', padding: '16px 0', fontSize: '18px', fontWeight: '900', cursor: 'pointer' 
            }}
          >
            PLAY MATCH
          </button>
        ) : (
          <div style={{ width: '100%', backgroundColor: '#1E488F', color: '#ffffff', borderRadius: '20px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: '800' }}>{formatTimer(queueTime)}</span>
            <button onClick={cancelQueue} style={{ backgroundColor: '#ef4444', border: 'none', color: '#ffffff', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer' }}>✕</button>
          </div>
        )}
      </div>

      {/* 5. Game History Section */}
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '800', color: '#001F3F' }}>Game History</h3>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {matchHistory.map((game, idx) => (
            <div key={game.id} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx !== matchHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {(game.opponentAvatars || [game.opponentAvatar]).map((avatar, aIdx) => (
                    <div key={aIdx} style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#001F3F', overflow: 'hidden' }}>
                      <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#001F3F' }}>{game.opponentName}</h4>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{game.date}</span>
                </div>
              </div>
              <span style={{ backgroundColor: game.result === 'WIN' ? '#DBE64C' : '#fee2e2', color: game.result === 'WIN' ? '#001F3F' : '#991b1b', fontSize: '11px', fontWeight: '900', padding: '4px 10px', borderRadius: '9999px' }}>
                {game.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}