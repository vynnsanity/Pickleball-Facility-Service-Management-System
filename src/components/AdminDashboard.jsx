// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const { 
    notifications, systemLogs, approveRequest, rejectRequest, 
    courts, setCourts, inventory, setInventory,
    currentRole, toggleRole, showAlert,
    activeMatch, resolveMatchResult
  } = useApp();

  const [activeModal, setActiveModal] = useState(null);

  // New Equipment Form
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState('Paddles');
  const [eqBrand, setEqBrand] = useState('PRO');
  const [eqRate, setEqRate] = useState(100);
  const [eqDesc, setEqDesc] = useState('');

  // New Court Form
  const [courtName, setCourtName] = useState('');
  const [courtType, setCourtType] = useState('Indoor');
  const [courtSurface, setCourtSurface] = useState('Pro Cushion Hardcourt');
  const [courtRate, setCourtRate] = useState(250);
  const [courtDesc, setCourtDesc] = useState('');

  const pendingNotifications = notifications.filter(n => n.status === 'Pending Approval');
  const hasPending = pendingNotifications.length > 0;

  const openCourtsCount = courts.filter(c => c.open && !c.isPending).length;
  const availableEquipmentsCount = inventory.filter(item => !item.isRented && !item.isPending).length;

  const membersList = [
    { id: 1, name: 'Chris', mmr: 3150, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris' },
    { id: 2, name: 'Nazzer', mmr: 2980, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer' },
    { id: 3, name: 'Soffy', mmr: 3100, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy' },
    { id: 4, name: 'Kier', mmr: 2850, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier' },
    { id: 5, name: 'Owen', mmr: 3200, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen' },
  ];

  const toggleCourtStatus = (courtId) => {
    setCourts(prev => prev.map(c => {
      if (c.id === courtId) {
        const nextOpen = !c.open;
        return { 
          ...c, 
          open: nextOpen, 
          isPending: false, 
          occupiedBy: nextOpen ? null : c.occupiedBy 
        };
      }
      return c;
    }));
  };

  const toggleEquipmentStatus = (itemId) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextRented = !item.isRented;
        return { 
          ...item, 
          isRented: nextRented, 
          isPending: false, 
          occupiedBy: nextRented ? item.occupiedBy : null 
        };
      }
      return item;
    }));
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    if (!eqName.trim()) return;

    const newItem = {
      id: `custom-eq-${Date.now()}`,
      name: eqName,
      brand: eqBrand,
      category: eqCategory,
      condition: 'Brand New',
      desc: eqDesc || 'Newly added equipment available for rent.',
      isRented: false,
      occupiedBy: null,
      isPending: false,
      baseRate: Number(eqRate) || 100,
    };

    setInventory(prev => [newItem, ...prev]);
    setActiveModal(null);
    setEqName('');
    setEqDesc('');
    showAlert('Equipment Added', `${newItem.name} has been successfully added to inventory.`, 'success');
  };

  const handleAddCourt = (e) => {
    e.preventDefault();
    if (!courtName.trim()) return;

    const newCourt = {
      id: `custom-court-${Date.now()}`,
      name: courtName,
      type: courtType,
      surface: courtSurface,
      desc: courtDesc || 'Newly constructed court facility.',
      open: true,
      occupiedBy: null,
      isPending: false,
      baseRate: Number(courtRate) || 250,
    };

    setCourts(prev => [newCourt, ...prev]);
    setActiveModal(null);
    setCourtName('');
    setCourtDesc('');
    showAlert('Court Added', `${newCourt.name} is now available for player reservations.`, 'success');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch'
    }}>
      
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        backgroundColor: '#f8fafc',
        padding: '24px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          flex: 1
        }}>
          
          {/* Left Column */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '800',
                  flexShrink: 0
                }}>
                  ⚙️
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>
                    Admin Panel
                  </h2>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 10px',
                    borderRadius: '9999px'
                  }}>
                    System Manager
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={toggleRole}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Toggle Role View"
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: currentRole === 'player' ? '#10b981' : '#f59e0b'
                  }}></span>
                  <span style={{ textTransform: 'capitalize' }}>{currentRole}</span>
                </button>
              </div>
            </div>

            {/* LIVE ONGOING MATCH RESOLVER */}
            {activeMatch && (
              <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '20px',
                padding: '16px',
                color: '#ffffff',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#10b981', letterSpacing: '0.05em' }}>
                    LIVE MATCH IN PROGRESS ({activeMatch.courtName.toUpperCase()})
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{activeMatch.format.toUpperCase()}</span>
                </div>

                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '800' }}>
                  {activeMatch.playerName} vs {activeMatch.opponentName}
                </h4>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => resolveMatchResult('player')}
                    style={{
                      flex: 1, backgroundColor: '#10b981', color: '#ffffff', border: 'none',
                      borderRadius: '10px', padding: '8px 0', fontSize: '11px', fontWeight: '800', cursor: 'pointer'
                    }}
                  >
                    Declare {activeMatch.playerName} Winner
                  </button>

                  <button
                    onClick={() => resolveMatchResult('opponent')}
                    style={{
                      flex: 1, backgroundColor: '#ef4444', color: '#ffffff', border: 'none',
                      borderRadius: '10px', padding: '8px 0', fontSize: '11px', fontWeight: '800', cursor: 'pointer'
                    }}
                  >
                    Declare {activeMatch.opponentName.split(' ')[0]} Winner
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => setActiveModal('requests')}
              style={{
                width: '100%',
                backgroundColor: '#032533',
                color: '#ffffff',
                border: hasPending ? '2px solid #ef4444' : 'none',
                borderRadius: '20px',
                padding: '18px 20px',
                fontSize: '16px',
                fontWeight: '800',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: hasPending ? '0 0 12px rgba(239, 68, 68, 0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              REVIEW PENDING REQUESTS (
              <span style={{ color: hasPending ? '#ef4444' : '#ffffff', fontWeight: '900' }}>
                {pendingNotifications.length}
              </span>
              )
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              
              <div 
                onClick={() => setActiveModal('inventory')}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '16px',
                  position: 'relative',
                  border: '1px solid #e2e8f0',
                  height: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <span style={{
                  position: 'absolute', top: '12px', right: '12px',
                  backgroundColor: '#dcfce7', color: '#166534',
                  fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px'
                }}>
                  {availableEquipmentsCount} / {inventory.length} Free
                </span>
                <div style={{ fontSize: '28px' }}>🏓</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0d1527' }}>Manage Inventory</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Equipment Status</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveModal('courts')}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '16px',
                  position: 'relative',
                  border: '1px solid #e2e8f0',
                  height: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <span style={{
                  position: 'absolute', top: '12px', right: '12px',
                  backgroundColor: '#dcfce7', color: '#166534',
                  fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px'
                }}>
                  {openCourtsCount} / {courts.length} Open
                </span>
                <div style={{ fontSize: '28px' }}>🏟️</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0d1527' }}>Manage Courts</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Court Availability</p>
                </div>
              </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <button 
                onClick={() => setActiveModal('addEquipment')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0d1527',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '12px 0',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                + Add Equipment
              </button>

              <button 
                onClick={() => setActiveModal('addCourt')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0d1527',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '12px 0',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                + Add Court
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0d1527' }}>Registered Members</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{membersList.length} Active Members</span>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                {membersList.map((member, idx) => (
                  <div key={member.id} style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: idx !== membersList.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                      }}>
                        <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0d1527' }}>{member.name}</h4>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Expires: {member.expiry}</span>
                      </div>
                    </div>

                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '9999px'
                    }}>
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Logs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0d1527' }}>Live System Logs</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Activity Feed</span>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              maxHeight: '520px',
              overflowY: 'auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {systemLogs.length === 0 ? (
                <p style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px', margin: 0 }}>
                  No active logs registered in the system.
                </p>
              ) : (
                systemLogs.map((log, idx) => {
                  const isPending = log.status === 'Pending Approval';
                  const isApproved = log.status === 'Approved';

                  return (
                    <div key={log.id} style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: idx !== systemLogs.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d1527' }}>
                            {log.playerName || 'Player'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>• {log.title}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                          Duration: {log.duration} {log.totalPrice ? `(${log.totalPrice})` : ''} at {log.timestamp}
                        </span>
                      </div>

                      <span style={{
                        backgroundColor: isPending ? '#fef3c7' : isApproved ? '#dcfce7' : '#fee2e2',
                        color: isPending ? '#92400e' : isApproved ? '#166534' : '#991b1b',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap'
                      }}>
                        {log.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ADMIN APPROVALS MODAL */}
      {activeModal === 'requests' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '20px',
            width: '100%',
            maxWidth: '380px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Admin Approvals</h3>
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800'
                }}
              >✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingNotifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '30px 0' }}>
                  No pending user requests right now.
                </p>
              ) : (
                pendingNotifications.map(notif => (
                  <div key={notif.id} style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d1527' }}>
                        {notif.playerName ? `${notif.playerName} - ${notif.title}` : notif.title}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{notif.timestamp}</span>
                    </div>

                    <p style={{ margin: '4px 0 10px 0', fontSize: '11px', color: '#475569' }}>
                      Duration: {notif.duration} | Price: {notif.totalPrice}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => approveRequest(notif.id, notif.targetId, notif.itemType)}
                        style={{
                          flex: 1, backgroundColor: '#10b981', color: '#ffffff', border: 'none',
                          borderRadius: '8px', padding: '6px 0', fontSize: '11px', fontWeight: '800', cursor: 'pointer'
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectRequest(notif.id, notif.targetId, notif.itemType)}
                        style={{
                          flex: 1, backgroundColor: '#ef4444', color: '#ffffff', border: 'none',
                          borderRadius: '8px', padding: '6px 0', fontSize: '11px', fontWeight: '800', cursor: 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANAGE INVENTORY MODAL */}
      {activeModal === 'inventory' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '20px',
            width: '100%',
            maxWidth: '380px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Inventory Status</h3>
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800'
                }}
              >✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inventory.map(item => {
                const isOccupied = item.isRented || item.isPending;
                const statusLabel = item.isPending 
                  ? `Pending (${item.occupiedBy || 'Player'})` 
                  : item.isRented 
                  ? item.occupiedBy ? `Occupied by ${item.occupiedBy}` : 'Occupied'
                  : 'Available';

                return (
                  <div key={item.id} style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d1527', display: 'block' }}>{item.name}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>₱{item.baseRate}/hr</span>
                    </div>

                    <button
                      onClick={() => toggleEquipmentStatus(item.id)}
                      style={{
                        backgroundColor: isOccupied ? '#fee2e2' : '#dcfce7',
                        color: isOccupied ? '#991b1b' : '#166534',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {statusLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MANAGE COURTS MODAL */}
      {activeModal === 'courts' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '20px',
            width: '100%',
            maxWidth: '380px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Courts Status</h3>
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800'
                }}
              >✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {courts.map(court => {
                const isOpen = court.open && !court.isPending;
                const statusLabel = court.isPending 
                  ? `Pending (${court.occupiedBy || 'Player'})` 
                  : !court.open 
                  ? court.occupiedBy ? `Occupied by ${court.occupiedBy}` : 'Occupied'
                  : 'Open';

                return (
                  <div key={court.id} style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d1527', display: 'block' }}>{court.name}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{court.type} • ₱{court.baseRate}/hr</span>
                    </div>

                    <button
                      onClick={() => toggleCourtStatus(court.id)}
                      style={{
                        backgroundColor: isOpen ? '#dcfce7' : '#fee2e2',
                        color: isOpen ? '#166534' : '#991b1b',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      {statusLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADD EQUIPMENT FORM MODAL */}
      {activeModal === 'addEquipment' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '380px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Add New Equipment</h3>
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800'
                }}
              >✕</button>
            </div>

            <form onSubmit={handleAddEquipment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  EQUIPMENT NAME
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Paddle Pair F"
                  value={eqName}
                  onChange={(e) => setEqName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                    fontSize: '13px', boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    CATEGORY
                  </label>
                  <select 
                    value={eqCategory} 
                    onChange={(e) => setEqCategory(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1',
                      fontSize: '12px', boxSizing: 'border-box', outline: 'none'
                    }}
                  >
                    <option value="Paddles">Paddles</option>
                    <option value="Balls">Balls</option>
                    <option value="Ball Machines">Ball Machines</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    HOURLY RATE (₱)
                  </label>
                  <input 
                    type="number" 
                    value={eqRate}
                    onChange={(e) => setEqRate(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                      fontSize: '13px', boxSizing: 'border-box', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  DESCRIPTION
                </label>
                <textarea 
                  placeholder="Short description of condition and specs..."
                  value={eqDesc}
                  onChange={(e) => setEqDesc(e.target.value)}
                  rows="2"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                    fontSize: '12px', boxSizing: 'border-box', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              <button 
                type="submit"
                style={{
                  marginTop: '8px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 0',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                SAVE EQUIPMENT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD COURT FORM MODAL */}
      {activeModal === 'addCourt' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '380px',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Add New Court</h3>
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800'
                }}
              >✕</button>
            </div>

            <form onSubmit={handleAddCourt} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  COURT NAME
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Court 6"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                    fontSize: '13px', boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    TYPE
                  </label>
                  <select 
                    value={courtType} 
                    onChange={(e) => setCourtType(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1',
                      fontSize: '12px', boxSizing: 'border-box', outline: 'none'
                    }}
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    HOURLY RATE (₱)
                  </label>
                  <input 
                    type="number" 
                    value={courtRate}
                    onChange={(e) => setCourtRate(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                      fontSize: '13px', boxSizing: 'border-box', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  SURFACE & SPECS
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Acrylic Composite Hardcourt"
                  value={courtSurface}
                  onChange={(e) => setCourtSurface(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                    fontSize: '12px', boxSizing: 'border-box', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  DESCRIPTION
                </label>
                <textarea 
                  placeholder="Short court features and lighting summary..."
                  value={courtDesc}
                  onChange={(e) => setCourtDesc(e.target.value)}
                  rows="2"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                    fontSize: '12px', boxSizing: 'border-box', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              <button 
                type="submit"
                style={{
                  marginTop: '8px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 0',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                SAVE COURT
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}