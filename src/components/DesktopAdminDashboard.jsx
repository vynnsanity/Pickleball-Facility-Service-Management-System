// src/components/DesktopAdminDashboard.jsx
import React from 'react';

export default function DesktopAdminDashboard({
  notifications,
  systemLogs,
  courts,
  inventory,
  currentRole,
  toggleRole,
  activeMatch,
  resolveMatchResult,
  cancelMatch,
  setActiveModal
}) {
  const pendingNotifications = notifications.filter(n => n.status === 'Pending Approval');
  const hasPending = pendingNotifications.length > 0;
  const openCourtsCount = courts.filter(c => c.open && !c.isPending).length;
  const availableEquipmentsCount = inventory.filter(item => !item.isRented && !item.isPending).length;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#001F3F',
            color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: '800'
          }}>
            ⚙️
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#001F3F' }}>Admin Panel</h2>
            <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '3px 10px', borderRadius: '9999px', marginTop: '4px', display: 'inline-block' }}>
              System Manager
            </span>
          </div>
        </div>

        <button
          onClick={toggleRole}
          style={{ backgroundColor: '#001F3F', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
        >
          {currentRole.toUpperCase()} VIEW
        </button>
      </header>

      {/* 2. Live Match Alert Banner */}
      {activeMatch && (
        <div style={{
          backgroundColor: '#001F3F', borderRadius: '20px', padding: '20px', color: '#ffffff', boxShadow: '0 4px 12px rgba(0, 31, 63, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#DBE64C', letterSpacing: '0.05em' }}>
              LIVE MATCH IN PROGRESS ({activeMatch.courtName.toUpperCase()})
            </span>
            <span style={{ fontSize: '12px', color: '#F6F7ED', opacity: 0.8 }}>{activeMatch.format.toUpperCase()}</span>
          </div>

          <h4 style={{ margin: '0 0 14px 0', fontSize: '17px', fontWeight: '800' }}>
            {activeMatch.playerName} vs {activeMatch.opponentName}
          </h4>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => resolveMatchResult('player')} 
              style={{ flex: 1, backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
            >
              Declare {activeMatch.playerName} Winner
            </button>
            <button 
              onClick={() => resolveMatchResult('opponent')} 
              style={{ flex: 1, backgroundColor: '#1E488F', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
            >
              Declare {activeMatch.opponentName} Winner
            </button>
            <button 
              onClick={cancelMatch} 
              style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
            >
              Cancel Match
            </button>
          </div>
        </div>
      )}

      {/* 3. Top 4-Card Horizontal Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1.2fr', gap: '20px' }}>
        <div 
          onClick={() => setActiveModal('requests')}
          style={{
            backgroundColor: '#001F3F', borderRadius: '24px', padding: '28px', color: '#ffffff',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer',
            minHeight: '190px', border: hasPending ? '2px solid #ef4444' : 'none',
            boxShadow: hasPending ? '0 0 16px rgba(239, 68, 68, 0.45)' : '0 4px 14px rgba(0,31,63,0.25)'
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: '800', color: hasPending ? '#ef4444' : '#DBE64C' }}>APPROVALS</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '900' }}>Pending Requests</h3>
            <span style={{ fontSize: '24px', fontWeight: '900', color: hasPending ? '#ef4444' : '#DBE64C', display: 'block', marginTop: '4px' }}>
              {pendingNotifications.length} Pending
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Review user booking items</p>
        </div>

        {/* Manage Inventory Card - Displays Available Free Items Tag */}
        <div 
          onClick={() => setActiveModal('inventory')}
          style={{
            backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer',
            position: 'relative', minHeight: '150px', boxShadow: '0 2px 8px rgba(0,31,63,0.05)'
          }}
        >
          <span style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '3px 8px', borderRadius: '8px' }}>
            {availableEquipmentsCount} Free
          </span>
          <div style={{ fontSize: '32px' }}>🏓</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#001F3F' }}>Inventory</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#1E488F' }}>Equipment status & rentals</p>
          </div>
        </div>

        {/* Manage Courts Card - Displays Open Courts Tag */}
        <div 
          onClick={() => setActiveModal('courts')}
          style={{
            backgroundColor: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer',
            position: 'relative', minHeight: '150px', boxShadow: '0 2px 8px rgba(0,31,63,0.05)'
          }}
        >
          <span style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '3px 8px', borderRadius: '8px' }}>
            {openCourtsCount} Open
          </span>
          <div style={{ fontSize: '32px' }}>🏟️</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#001F3F' }}>Manage Courts</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#1E488F' }}>Court availability control</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
          <button onClick={() => setActiveModal('addEquipment')} style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '18px', padding: '22px 16px', fontSize: '15px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 128, 76, 0.35)' }}>
            + Add Equipment
          </button>

          <button onClick={() => setActiveModal('addCourt')} style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '18px', padding: '22px 16px', fontSize: '15px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 128, 76, 0.35)' }}>
            + Add Court
          </button>
        </div>
      </section>

      {/* 4. Live System Logs */}
      <section style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,31,63,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Live System Logs</h3>
          <span style={{ fontSize: '12px', color: '#1E488F', fontWeight: '600' }}>Activity Feed</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
          {systemLogs.length === 0 ? (
            <p style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
              No active logs registered in the system.
            </p>
          ) : (
            systemLogs.map((log) => {
              const isPending = log.status === 'Pending Approval';
              const isApproved = log.status === 'Approved';

              return (
                <div key={log.id} style={{
                  padding: '14px 18px', backgroundColor: '#F6F7ED', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{log.playerName || 'Player'}</span>
                      <span style={{ fontSize: '13px', color: '#1E488F' }}>• {log.title}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      Duration: {log.duration} {log.totalPrice ? `(${log.totalPrice})` : ''} at {log.timestamp}
                    </span>
                  </div>

                  <span style={{
                    backgroundColor: isPending ? '#fef3c7' : isApproved ? '#DBE64C' : '#fee2e2',
                    color: isPending ? '#92400e' : isApproved ? '#001F3F' : '#991b1b',
                    fontSize: '11px', fontWeight: '900', padding: '5px 12px', borderRadius: '9999px', whiteSpace: 'nowrap'
                  }}>
                    {log.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}