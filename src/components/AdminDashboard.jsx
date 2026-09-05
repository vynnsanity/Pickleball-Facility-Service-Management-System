// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const { 
    notifications, approveRequest, rejectRequest, 
    courts, setCourts, inventory, setInventory,
    currentRole, toggleRole 
  } = useApp();

  const [activeModal, setActiveModal] = useState(null);

  // Filter pending items so rejected/approved ones leave the admin view
  const pendingNotifications = notifications.filter(n => n.status === 'Pending Approval');

  const openCourtsCount = courts.filter(c => c.open && !c.isPending).length;
  const availableEquipmentsCount = inventory.filter(item => !item.isRented && !item.isPending).length;

  const membersList = [
    { id: 1, name: 'Venedict', mmr: 3249, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Venedict' },
    { id: 2, name: 'Chris', mmr: 3150, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chris' },
    { id: 3, name: 'Nazzer', mmr: 2980, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nazzer' },
    { id: 4, name: 'Soffy', mmr: 3100, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Soffy' },
    { id: 5, name: 'Kier', mmr: 2850, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kier' },
    { id: 6, name: 'Owen', mmr: 3200, expiry: 'Dec 25, 2026', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Owen' },
  ];

  const toggleCourtStatus = (courtId) => {
    setCourts(prev => prev.map(c => 
      c.id === courtId ? { ...c, open: !c.open, isPending: false } : c
    ));
  };

  const toggleEquipmentStatus = (itemId) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, isRented: !item.isRented, isPending: false } : item
    ));
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
      
      {/* Edge-to-Edge Canvas Container */}
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

        {/* Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          flex: 1
        }}>
          
          {/* Left Column */}
          <div>
            {/* Admin Header */}
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

              {/* Action Controls */}
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

            {/* Review Pending Requests (Promoted to Top Position) */}
            <button 
              onClick={() => setActiveModal('requests')}
              style={{
                width: '100%',
                backgroundColor: '#032533',
                color: '#ffffff',
                border: 'none',
                borderRadius: '20px',
                padding: '18px 20px',
                fontSize: '16px',
                fontWeight: '800',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              REVIEW PENDING REQUESTS ({pendingNotifications.length})
            </button>

            {/* Management Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              
              {/* Inventory Tile */}
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

              {/* Courts Tile */}
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

            {/* Additional Feature Action Buttons */}
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

            {/* Registered Members Section */}
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
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0d1527', lineHeight: '1.2' }}>
                          {member.name}
                        </h4>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', display: 'block', marginTop: '2px' }}>
                          Expires: {member.expiry}
                        </span>
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
              <span style={{ fontSize: '12px', color: '#64748b' }}>Admin Log</span>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              maxHeight: '440px',
              overflowY: 'auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {pendingNotifications.length === 0 ? (
                <p style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px', margin: 0 }}>
                  No pending actions registered in the system.
                </p>
              ) : (
                pendingNotifications.map((notif, idx) => (
                  <div key={notif.id} style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: idx !== pendingNotifications.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0d1527' }}>{notif.title}</h4>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                        {notif.duration} • {notif.totalPrice} ({notif.timestamp})
                      </span>
                    </div>

                    <span style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '9999px'
                    }}>
                      Pending
                    </span>
                  </div>
                ))
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
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d1527' }}>{notif.title}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{notif.timestamp}</span>
                    </div>

                    <p style={{ margin: '4px 0 10px 0', fontSize: '11px', color: '#475569' }}>
                      Duration: {notif.duration} | Price: {notif.totalPrice}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => approveRequest(notif.id, notif.targetId, notif.itemType)}
                        style={{
                          flex: 1,
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 0',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectRequest(notif.id, notif.targetId, notif.itemType)}
                        style={{
                          flex: 1,
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 0',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer'
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
                      {item.isPending ? 'Pending' : item.isRented ? 'Occupied' : 'Available'}
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
                      {court.isPending ? 'Pending' : court.open ? 'Open' : 'Occupied'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADD EQUIPMENT MODAL (COMING SOON) */}
      {activeModal === 'addEquipment' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px 24px',
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏓</div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Add Equipment</h3>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 12px',
              borderRadius: '9999px',
              marginBottom: '16px'
            }}>
              Coming Soon
            </span>
            <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
              Equipment inventory creation tools will be available in the next update.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 0',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ADD COURT MODAL (COMING SOON) */}
      {activeModal === 'addCourt' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px 24px',
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏟️</div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Add Court</h3>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 12px',
              borderRadius: '9999px',
              marginBottom: '16px'
            }}>
              Coming Soon
            </span>
            <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
              Court creation and scheduling config options will be available in the next update.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 0',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}