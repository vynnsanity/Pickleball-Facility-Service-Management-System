// src/components/MobileAdminDashboard.jsx
import React from 'react';

export default function MobileAdminDashboard({
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Header Bar */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '20px', 
        padding: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        border: '1px solid #DBE64C' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '14px', 
            backgroundColor: '#001F3F', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '20px' 
          }}>
            ⚙️
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Admin Panel</h2>
            <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '2px 8px', borderRadius: '9999px' }}>
              Manager
            </span>
          </div>
        </div>
        <button 
          onClick={toggleRole} 
          style={{ backgroundColor: '#001F3F', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
        >
          {currentRole}
        </button>
      </div>

      {/* 2. Live Match Alert Banner with Full Opponent Name Fix */}
      {activeMatch && (
        <div style={{
          backgroundColor: '#001F3F', borderRadius: '20px', padding: '16px', color: '#ffffff', boxShadow: '0 4px 12px rgba(0, 31, 63, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#DBE64C' }}>
              LIVE MATCH ({activeMatch.courtName.toUpperCase()})
            </span>
            <span style={{ fontSize: '11px', color: '#F6F7ED', opacity: 0.8 }}>{activeMatch.format.toUpperCase()}</span>
          </div>

          <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '800' }}>
            {activeMatch.playerName} vs {activeMatch.opponentName}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => resolveMatchResult('player')} 
              style={{ width: '100%', backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 0', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              Declare {activeMatch.playerName} Winner
            </button>
            <button 
              onClick={() => resolveMatchResult('opponent')} 
              style={{ width: '100%', backgroundColor: '#1E488F', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 0', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              Declare {activeMatch.opponentName} Winner
            </button>
            <button 
              onClick={cancelMatch} 
              style={{ width: '100%', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 0', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              Cancel Match
            </button>
          </div>
        </div>
      )}

      {/* 3. Review Requests Button */}
      <button 
        onClick={() => setActiveModal('requests')} 
        style={{ 
          width: '100%', 
          backgroundColor: '#001F3F', 
          color: '#ffffff', 
          border: hasPending ? '2px solid #ef4444' : 'none', 
          borderRadius: '20px', 
          padding: '16px', 
          fontSize: '15px', 
          fontWeight: '900', 
          cursor: 'pointer',
          boxShadow: hasPending ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none'
        }}
      >
        REVIEW REQUESTS ({pendingNotifications.length})
      </button>

      {/* 4. Quick Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div onClick={() => setActiveModal('inventory')} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '16px', border: '1px solid #e2e8f0', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ fontSize: '26px' }}>🏓</div>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Manage Inventory</h3>
        </div>
        <div onClick={() => setActiveModal('courts')} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '16px', border: '1px solid #e2e8f0', height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ fontSize: '26px' }}>🏟️</div>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Manage Courts</h3>
        </div>
      </div>

      {/* 5. Add Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button onClick={() => setActiveModal('addEquipment')} style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '16px', padding: '14px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
          + Add Equipment
        </button>

        <button onClick={() => setActiveModal('addCourt')} style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '16px', padding: '14px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
          + Add Court
        </button>
      </div>

      {/* 6. Live System Logs List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#001F3F' }}>Live System Logs</h3>
          <span style={{ fontSize: '11px', color: '#1E488F', fontWeight: '600' }}>Activity Feed</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {systemLogs.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', margin: '20px 0' }}>
              No active logs registered in system.
            </p>
          ) : (
            systemLogs.map((log) => {
              const isPending = log.status === 'Pending Approval';
              const isApproved = log.status === 'Approved';

              return (
                <div key={log.id} style={{
                  padding: '10px 12px', backgroundColor: '#F6F7ED', borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#001F3F' }}>
                      {log.playerName || 'Player'}
                    </span>
                    <span style={{
                      backgroundColor: isPending ? '#fef3c7' : isApproved ? '#DBE64C' : '#fee2e2',
                      color: isPending ? '#92400e' : isApproved ? '#001F3F' : '#991b1b',
                      fontSize: '10px', fontWeight: '900', padding: '2px 8px', borderRadius: '9999px'
                    }}>
                      {log.status}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#1E488F' }}>{log.title}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    {log.duration} {log.totalPrice ? `(${log.totalPrice})` : ''} • {log.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}