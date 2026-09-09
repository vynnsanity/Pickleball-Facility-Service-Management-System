// src/components/DesktopPlayerDashboard.jsx
import React from 'react';

export default function DesktopPlayerDashboard({ 
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Bar */}
      <header style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#ffffff', 
        borderRadius: '20px', 
        padding: '18px 24px',
        border: '1px solid #DBE64C', 
        boxShadow: '0 2px 8px rgba(0,31,63,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#001F3F', overflow: 'hidden' }}>
            <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#001F3F' }}>
              {profile.fullName.split(' ')[0]}
            </h2>
            <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '3px 10px', borderRadius: '9999px' }}>
              {profile.mmr} MMR
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={toggleRole} 
            style={{ backgroundColor: '#001F3F', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            {currentRole.toUpperCase()} VIEW
          </button>
          <button 
            onClick={() => setActiveModal('notifications')} 
            style={{ position: 'relative', backgroundColor: '#001F3F', color: '#ffffff', border: 'none', width: '44px', height: '44px', borderRadius: '12px', fontSize: '18px', cursor: 'pointer' }}
          >
            🔔
            {pendingNotifsCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '900', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingNotifsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Top 4-Card Row (Play Match Enlarged to 1.8fr) */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: '20px' }}>
        {/* ENLARGED: Play Match Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '28px', 
          border: '1px solid #e2e8f0', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          minHeight: '190px', 
          boxShadow: '0 4px 12px rgba(0,31,63,0.08)' 
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#1E488F', letterSpacing: '0.05em' }}>ONLINE QUEUE</span>
            <h3 style={{ margin: '6px 0 16px 0', fontSize: '22px', fontWeight: '900', color: '#001F3F' }}>Play Match</h3>
          </div>
          {activeMatch ? (
            <button onClick={() => setMatchFoundModal(activeMatch)} style={{ width: '100%', backgroundColor: '#001F3F', color: '#DBE64C', border: '2px solid #DBE64C', borderRadius: '14px', padding: '16px 0', fontSize: '15px', fontWeight: '900', cursor: 'pointer' }}>
              IN MATCH ({activeMatch.courtName.toUpperCase()})
            </button>
          ) : !isQueuing ? (
            <button onClick={() => setActiveModal('matchmaking')} style={{ width: '100%', backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '16px 0', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 128, 76, 0.35)' }}>
              Start Game
            </button>
          ) : (
            <div style={{ backgroundColor: '#1E488F', color: '#ffffff', borderRadius: '14px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '800' }}>{formatTimer(queueTime)}</span>
              <button onClick={cancelQueue} style={{ backgroundColor: '#ef4444', border: 'none', color: '#fff', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
          )}
        </div>

        {/* Equipments Card */}
        <div onClick={() => setActiveModal('inventory')} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', position: 'relative', minHeight: '150px', boxShadow: '0 2px 8px rgba(0,31,63,0.05)' }}>
          <span style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '3px 8px', borderRadius: '8px' }}>{equipments} Free</span>
          <div style={{ fontSize: '32px' }}>🏓</div>
          <div><h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#001F3F' }}>Equipments</h3></div>
        </div>

        {/* Courts Card */}
        <div onClick={() => setActiveModal('courts')} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', position: 'relative', minHeight: '150px', boxShadow: '0 2px 8px rgba(0,31,63,0.05)' }}>
          <span style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '3px 8px', borderRadius: '8px' }}>{courts.filter(c => c.open && !c.isPending).length} Open</span>
          <div style={{ fontSize: '32px' }}>🏟️</div>
          <div><h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#001F3F' }}>Courts</h3></div>
        </div>

        {/* Plan Status Card */}
        <div style={{ backgroundColor: '#001F3F', borderRadius: '20px', padding: '20px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px', boxShadow: '0 4px 12px rgba(0, 31, 63, 0.2)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#DBE64C' }}>PLAN STATUS</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>Membership</h3>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#DBE64C' }}>{profile.isMember ? 'Active' : 'Inactive'}</span>
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: '#F6F7ED', opacity: 0.8 }}>Expires: {profile.membershipExpiry}</p>
        </div>
      </section>

      {/* 3. Game History Section */}
      <section style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,31,63,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Game History</h3>
          <span style={{ fontSize: '12px', color: '#1E488F', fontWeight: '600' }}>{matchHistory.length} Matches Logged</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {matchHistory.map((game) => (
            <div key={game.id} style={{ padding: '14px 18px', backgroundColor: '#F6F7ED', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {(game.opponentAvatars || [game.opponentAvatar]).map((avatar, aIdx) => (
                    <div key={aIdx} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#001F3F', overflow: 'hidden' }}>
                      <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#001F3F' }}>{game.opponentName}</h4>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{game.date}</span>
                </div>
              </div>
              <span style={{ backgroundColor: game.result === 'WIN' ? '#DBE64C' : '#fee2e2', color: game.result === 'WIN' ? '#001F3F' : '#991b1b', fontSize: '12px', fontWeight: '900', padding: '5px 14px', borderRadius: '9999px' }}>
                {game.result}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}