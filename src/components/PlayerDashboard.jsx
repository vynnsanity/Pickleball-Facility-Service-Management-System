// src/components/PlayerDashboard.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PlayerDashboard() {
  const { 
    profile, 
    matchHistory, 
    notifications, 
    dismissNotification,
    inventory, 
    rentItem, 
    courts, 
    bookCourt, 
    equipments, 
    isQueuing, 
    queueTime, 
    startQueue, 
    cancelQueue, 
    activeMatch,
    matchFoundModal,
    setMatchFoundModal,
    currentRole, 
    toggleRole 
  } = useApp();

  const [activeModal, setActiveModal] = useState(null);
  const [playFormat, setPlayFormat] = useState('single');
  const [rentDuration, setRentDuration] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const pendingNotifsCount = notifications.length;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRentClick = (item) => {
    setSelectedItem(item);
    setActiveModal('rentConfirm');
  };

  const handleCourtClick = (court) => {
    setSelectedItem(court);
    setActiveModal('courtConfirm');
  };

  const confirmRental = () => {
    if (selectedItem) {
      rentItem(selectedItem.id, rentDuration);
      setSelectedItem(null);
      setActiveModal(null);
    }
  };

  const confirmBooking = () => {
    if (selectedItem) {
      bookCourt(selectedItem.id, rentDuration);
      setSelectedItem(null);
      setActiveModal(null);
    }
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

        {/* 1. Profile Header Card */}
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
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>
                {profile.fullName.split(' ')[0]}
              </h2>
              <span style={{
                display: 'inline-block',
                marginTop: '4px',
                backgroundColor: '#dcfce7',
                color: '#166534',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 10px',
                borderRadius: '9999px'
              }}>
                {profile.mmr} MMR
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

            <button
              onClick={() => setActiveModal('notifications')}
              style={{
                position: 'relative',
                backgroundColor: '#f1f5f9',
                border: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              🔔
              {pendingNotifsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '900',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {pendingNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', flex: 1 }}>
          
          {/* Left Main Controls */}
          <div>
            {/* 2. Membership Status Card */}
            <div style={{
              backgroundColor: '#032533',
              borderRadius: '20px',
              padding: '18px 20px',
              color: '#ffffff',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(3, 37, 51, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                  Membership:
                </h3>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
                  {profile.isMember ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8', opacity: 0.9 }}>
                Expires in: {profile.membershipExpiry}
              </p>
            </div>

            {/* 3. Equipments & Courts Quick Cards */}
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
                  {equipments} Available
                </span>
                <div style={{ fontSize: '28px' }}>🏓</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0d1527' }}>Equipments</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Paddles, Balls & Machines</p>
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
                  {courts.filter(c => c.open && !c.isPending).length} Open
                </span>
                <div style={{ fontSize: '28px' }}>🏟️</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0d1527' }}>Courts</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Indoor & Outdoor</p>
                </div>
              </div>
            </div>

            {/* 4. Play Match / Queuing Action Bar */}
            <div style={{ marginBottom: '16px' }}>
              {activeMatch ? (
                <button
                  onClick={() => setMatchFoundModal(activeMatch)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    color: '#10b981',
                    border: '2px solid #10b981',
                    borderRadius: '20px',
                    padding: '16px 0',
                    fontSize: '16px',
                    fontWeight: '900',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  IN MATCH ({activeMatch.courtName.toUpperCase()})
                </button>
              ) : !isQueuing ? (
                <button
                  onClick={() => setActiveModal('matchmaking')}
                  style={{
                    width: '100%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '16px 0',
                    fontSize: '18px',
                    fontWeight: '800',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  PLAY MATCH
                </button>
              ) : (
                <div style={{
                  width: '100%',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxSizing: 'border-box'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: '700', textTransform: 'uppercase', display: 'block', opacity: 0.9 }}>
                      Queuing...
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.05em' }}>
                      {formatTimer(queueTime)}
                    </span>
                  </div>

                  <button
                    onClick={cancelQueue}
                    style={{
                      backgroundColor: '#ef4444',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '10px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                    title="Cancel Queue"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 5. Game History List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0d1527' }}>Game History</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{matchHistory.length} Matches Logged</span>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {matchHistory.map((game, idx) => (
                <div key={game.id} style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: idx !== matchHistory.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                    }}>
                      <img src={game.opponentAvatar} alt={game.opponentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0d1527' }}>{game.opponentName}</h4>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{game.date}</span>
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: game.result === 'WIN' ? '#dcfce7' : '#fee2e2',
                    color: game.result === 'WIN' ? '#166534' : '#991b1b',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '9999px'
                  }}>
                    {game.result}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* MATCH PLAY FORMAT MODAL */}
      {activeModal === 'matchmaking' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.82)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxSizing: 'border-box',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0d1527' }}>
                  Match Play
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginTop: '2px', display: 'block' }}>
                  Random Matchmaking Queue
                </span>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)'
                }}
              >
                ✕
              </button>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: '900',
              color: '#0d1527',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '10px'
            }}>
              CHOOSE PLAY FORMAT
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setPlayFormat('single')}
                style={{
                  backgroundColor: playFormat === 'single' ? '#0f172a' : '#ffffff',
                  color: playFormat === 'single' ? '#ffffff' : '#0f172a',
                  border: '2px solid #0f172a',
                  borderRadius: '16px',
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: '800', display: 'block', marginBottom: '2px' }}>
                  Single
                </span>
                <span style={{ fontSize: '10px', color: playFormat === 'single' ? '#94a3b8' : '#64748b', fontWeight: '500' }}>
                  1 vs 1 Duel
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPlayFormat('double')}
                style={{
                  backgroundColor: playFormat === 'double' ? '#0f172a' : '#ffffff',
                  color: playFormat === 'double' ? '#ffffff' : '#0f172a',
                  border: '2px solid #0f172a',
                  borderRadius: '16px',
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: '800', display: 'block', marginBottom: '2px' }}>
                  Double
                </span>
                <span style={{ fontSize: '10px', color: playFormat === 'double' ? '#94a3b8' : '#64748b', fontWeight: '500' }}>
                  2 vs 2 Team
                </span>
              </button>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e2e8f0',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                Your MMR Rating:
              </span>
              <span style={{
                backgroundColor: '#dcfce7',
                color: '#15803d',
                fontSize: '12px',
                fontWeight: '800',
                padding: '4px 12px',
                borderRadius: '9999px'
              }}>
                {profile.mmr} MMR
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                startQueue(playFormat);
              }}
              style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 0',
                fontSize: '16px',
                fontWeight: '900',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              MATCH NOW
            </button>
          </div>
        </div>
      )}

      {/* MATCH FOUND ANNOUNCEMENT MODAL */}
      {matchFoundModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.82)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 120
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px 24px',
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
            boxSizing: 'border-box',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              fontSize: '11px',
              fontWeight: '900',
              padding: '4px 12px',
              borderRadius: '9999px',
              letterSpacing: '0.05em',
              marginBottom: '12px'
            }}>
              MATCH FOUND
            </span>

            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '900', color: '#0d1527' }}>
              vs {matchFoundModal.opponentName}
            </h3>

            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              Please proceed to <strong>{matchFoundModal.courtName}</strong> for your match.
            </p>

            <button
              onClick={() => setMatchFoundModal(null)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 0',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                letterSpacing: '0.05em'
              }}
            >
              PROCEED TO COURT
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {activeModal === 'notifications' && (
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Pending & Updates</h3>
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800'
                }}
              >✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '30px 0' }}>
                  No notifications right now.
                </p>
              ) : (
                notifications.map(notif => {
                  const isApproved = notif.status === 'Approved';
                  const isRejected = notif.status === 'Rejected';

                  return (
                    <div key={notif.id} style={{
                      backgroundColor: isApproved ? '#f0fdf4' : isRejected ? '#fef2f2' : '#f8fafc',
                      border: `1px solid ${isApproved ? '#86efac' : isRejected ? '#fca5a5' : '#e2e8f0'}`,
                      borderRadius: '14px',
                      padding: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d1527' }}>{notif.title}</span>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>{notif.timestamp}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#475569' }}>{notif.duration} • {notif.totalPrice}</span>
                        <span style={{
                          backgroundColor: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                          color: isApproved ? '#166534' : isRejected ? '#991b1b' : '#92400e',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}>
                          {isApproved ? 'Request Approved' : isRejected ? 'Request Rejected' : notif.status}
                        </span>
                      </div>

                      <button
                        onClick={() => dismissNotification(notif.id, notif.targetId, notif.itemType, notif.status === 'Pending Approval')}
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          backgroundColor: isApproved || isRejected ? '#64748b' : '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 0',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {isApproved || isRejected ? 'Dismiss Notification' : 'Cancel Request'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENT INVENTORY MODAL */}
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Available Equipment</h3>
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
                const isUnavailable = item.isRented || item.isPending;

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
                      <span style={{ fontSize: '10px', color: '#64748b' }}>₱{item.baseRate}/hr • {item.condition}</span>
                    </div>

                    <button
                      disabled={isUnavailable}
                      onClick={() => handleRentClick(item)}
                      style={{
                        backgroundColor: isUnavailable ? '#e2e8f0' : '#10b981',
                        color: isUnavailable ? '#94a3b8' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: isUnavailable ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {item.isPending ? 'Pending' : item.isRented ? 'Occupied' : 'Rent Item'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOOK COURT MODAL */}
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Court Availability</h3>
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
                const isUnavailable = !court.open || court.isPending;

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
                      disabled={isUnavailable}
                      onClick={() => handleCourtClick(court)}
                      style={{
                        backgroundColor: isUnavailable ? '#e2e8f0' : '#10b981',
                        color: isUnavailable ? '#94a3b8' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: isUnavailable ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {court.isPending ? 'Pending' : !court.open ? 'Occupied' : 'Book Court'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RENT DURATION MODAL */}
      {activeModal === 'rentConfirm' && selectedItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 110
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>
              Rent {selectedItem.name}
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
              Base Rate: ₱{selectedItem.baseRate}/hr
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
                SELECT DURATION (HOURS)
              </label>
              <select
                value={rentDuration}
                onChange={(e) => setRentDuration(Number(e.target.value))}
                style={{
                  width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1',
                  fontSize: '13px', outline: 'none'
                }}
              >
                <option value={1}>1 Hour - ₱{selectedItem.baseRate * 1}</option>
                <option value={2}>2 Hours - ₱{selectedItem.baseRate * 2}</option>
                <option value={3}>3 Hours - ₱{selectedItem.baseRate * 3}</option>
                <option value={4}>4 Hours - ₱{selectedItem.baseRate * 4}</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={confirmRental}
                style={{
                  flex: 1, backgroundColor: '#10b981', color: '#ffffff', border: 'none',
                  borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer'
                }}
              >
                Submit Request
              </button>
              <button
                onClick={() => setActiveModal('inventory')}
                style={{
                  flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', border: 'none',
                  borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer'
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COURT BOOKING MODAL */}
      {activeModal === 'courtConfirm' && selectedItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 21, 39, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 110
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '360px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>
              Book {selectedItem.name}
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
              {selectedItem.type} • ₱{selectedItem.baseRate}/hr
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
                SELECT DURATION (HOURS)
              </label>
              <select
                value={rentDuration}
                onChange={(e) => setRentDuration(Number(e.target.value))}
                style={{
                  width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1',
                  fontSize: '13px', outline: 'none'
                }}
              >
                <option value={1}>1 Hour - ₱{selectedItem.baseRate * 1}</option>
                <option value={2}>2 Hours - ₱{selectedItem.baseRate * 2}</option>
                <option value={3}>3 Hours - ₱{selectedItem.baseRate * 3}</option>
                <option value={4}>4 Hours - ₱{selectedItem.baseRate * 4}</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={confirmBooking}
                style={{
                  flex: 1, backgroundColor: '#10b981', color: '#ffffff', border: 'none',
                  borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer'
                }}
              >
                Submit Booking
              </button>
              <button
                onClick={() => setActiveModal('courts')}
                style={{
                  flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', border: 'none',
                  borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer'
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}