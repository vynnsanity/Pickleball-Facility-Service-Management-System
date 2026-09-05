// src/components/PlayerDashboard.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EquipmentRentalModal from './EquipmentRentalModal';
import CourtRentalModal from './CourtRentalModal';

export default function PlayerDashboard() {
  const { 
    profile, matchHistory, notifications, dismissNotification, courts, 
    equipments, isQueuing, queueTime, 
    startQueue, cancelQueue, currentRole, toggleRole 
  } = useApp();

  const [activeModal, setActiveModal] = useState(null);
  const [playFormat, setPlayFormat] = useState('single');

  const openCourtsCount = courts.filter(c => c.open && !c.isPending).length;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmMatchNow = () => {
    setActiveModal(null);
    startQueue();
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
      
      {/* Full Canvas Container */}
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

        {/* Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          flex: 1
        }}>
          
          {/* Left Column */}
          <div>
            {/* Header Controls (Profile + Role Switcher + Notification Bell) */}
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
              {/* Profile Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img 
                    src={profile.avatarUrl} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>{profile.fullName}</h2>
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

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                
                {/* Role Switcher */}
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

                {/* Notifications Bell */}
                <button
                  onClick={() => setActiveModal('notifications')}
                  style={{
                    position: 'relative',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  title="Notifications"
                >
                  <span style={{ fontSize: '16px' }}>🔔</span>
                  {notifications.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: '800',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {notifications.length}
                    </span>
                  )}
                </button>

              </div>
            </div>

            {/* Membership Banner */}
            <div style={{
              backgroundColor: '#032533',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '18px 20px',
              marginBottom: '16px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800' }}>
                Membership: <span style={{ color: profile.isMember ? '#34d399' : '#f87171' }}>
                  {profile.isMember ? 'Active' : 'Inactive'}
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Expires in: {profile.membershipExpiry}
              </p>
            </div>

            {/* Rental Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              
              {/* Equipment Tile */}
              <div 
                onClick={() => setActiveModal('equipment')}
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

              {/* Court Tile */}
              <div 
                onClick={() => setActiveModal('court')}
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
                  {openCourtsCount} Open
                </span>
                <div style={{ fontSize: '28px' }}>🏟️</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#0d1527' }}>Courts</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Indoor & Outdoor</p>
                </div>
              </div>

            </div>

            {/* Play Match / Queuing Action Bar */}
            {!isQueuing ? (
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

          {/* Right Column (Game History) */}
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
              maxHeight: '440px',
              overflowY: 'auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              {matchHistory.map((game, idx) => (
                <div key={game.id} style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: idx !== matchHistory.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                    }}>
                      <img 
                        src={game.opponentAvatar} 
                        alt={game.opponentName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0d1527', lineHeight: '1.2' }}>
                        {game.opponentName}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', display: 'block', marginTop: '2px' }}>
                        {game.date || '09/05/2026'}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '6px',
                    backgroundColor: game.result === 'WIN' ? '#dcfce7' : '#fee2e2',
                    color: game.result === 'WIN' ? '#166534' : '#991b1b'
                  }}>
                    {game.result}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

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
                  No pending notifications right now.
                </p>
              ) : (
                notifications.map(notif => {
                  const isRejected = notif.status === 'Rejected';

                  return (
                    <div key={notif.id} style={{
                      backgroundColor: isRejected ? '#fef2f2' : '#f8fafc',
                      border: `1px solid ${isRejected ? '#fca5a5' : '#e2e8f0'}`,
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
                          backgroundColor: isRejected ? '#fee2e2' : '#fef3c7',
                          color: isRejected ? '#991b1b' : '#92400e',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}>
                          {isRejected ? 'Request Rejected' : notif.status}
                        </span>
                      </div>

                      <button
                        onClick={() => dismissNotification(notif.id, notif.targetId, notif.itemType, !isRejected)}
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          backgroundColor: isRejected ? '#64748b' : '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 0',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        {isRejected ? 'Dismiss Notification' : 'Cancel Request'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* MATCH PLAY MODAL */}
      {activeModal === 'matchmaking' && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0d1527' }}>Match Play</h3>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Random Matchmaking Queue</p>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800'
                }}
              >✕</button>
            </div>

            <p style={{ fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '0.05em', marginBottom: '10px' }}>
              CHOOSE PLAY FORMAT
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div 
                onClick={() => setPlayFormat('single')}
                style={{
                  backgroundColor: playFormat === 'single' ? '#0d1527' : '#ffffff',
                  color: playFormat === 'single' ? '#ffffff' : '#0d1527',
                  border: '2px solid #0d1527',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer'
                }}
              >
                <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '800' }}>Single</h4>
                <p style={{ margin: 0, fontSize: '10px', opacity: 0.7 }}>1 vs 1 Duel</p>
              </div>

              <div 
                onClick={() => setPlayFormat('double')}
                style={{
                  backgroundColor: playFormat === 'double' ? '#0d1527' : '#ffffff',
                  color: playFormat === 'double' ? '#ffffff' : '#0d1527',
                  border: '2px solid #0d1527',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer'
                }}
              >
                <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '800' }}>Double</h4>
                <p style={{ margin: 0, fontSize: '10px', opacity: 0.7 }}>2 vs 2 Team</p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Your MMR Rating:</span>
              <span style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '800'
              }}>
                {profile.mmr} MMR
              </span>
            </div>

            <button 
              onClick={handleConfirmMatchNow}
              style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '14px 0',
                fontSize: '14px',
                fontWeight: '800',
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }}
            >
              MATCH NOW
            </button>
          </div>
        </div>
      )}

      {/* EQUIPMENTS MODAL */}
      {activeModal === 'equipment' && (
        <EquipmentRentalModal onClose={() => setActiveModal(null)} />
      )}

      {/* COURTS MODAL */}
      {activeModal === 'court' && (
        <CourtRentalModal onClose={() => setActiveModal(null)} />
      )}

    </div>
  );
}