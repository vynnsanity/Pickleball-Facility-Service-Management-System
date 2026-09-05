// src/components/PlayerDashboard.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EquipmentRentalModal from './EquipmentRentalModal';
import CourtRentalModal from './CourtRentalModal';

export default function PlayerDashboard() {
  const { 
    profile, matchHistory, notifications, cancelRequest, courts, 
    equipments, isQueuing, queueTime, 
    startQueue, cancelQueue, viewType 
  } = useApp();

  const [activeModal, setActiveModal] = useState(null);
  const [playFormat, setPlayFormat] = useState('single');

  const openCourtsCount = courts.filter(c => c.open).length;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmMatchNow = () => {
    setActiveModal(null);
    startQueue();
  };

  const isDesktop = viewType === 'desktop';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: isDesktop ? '1100px' : '390px',
        backgroundColor: '#ffffff',
        borderRadius: isDesktop ? '24px' : '40px',
        padding: isDesktop ? '32px' : '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        border: isDesktop ? '2px solid #334155' : '8px solid #334155',
        boxSizing: 'border-box',
        position: 'relative',
        transition: 'all 0.3s ease-in-out'
      }}>
        
        {!isDesktop && (
          <div style={{
            width: '110px',
            height: '22px',
            backgroundColor: '#000000',
            borderRadius: '12px',
            margin: '0 auto 20px auto'
          }}></div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: '24px'
        }}>
          
          {/* Left Column */}
          <div>
            {/* Profile Header */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={profile.avatarUrl} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>{profile.fullName}</h2>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    backgroundColor: '#4ade80',
                    color: '#064e3b',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '3px 12px',
                    borderRadius: '9999px'
                  }}>
                    {profile.mmr} MMR
                  </span>
                </div>
              </div>

              {/* Notification Button */}
              <button
                onClick={() => setActiveModal('notifications')}
                style={{
                  position: 'relative',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Notifications"
              >
                <span style={{ fontSize: '18px' }}>🔔</span>
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

            {/* Membership Banner */}
            <div style={{
              backgroundColor: '#032533',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700' }}>
                Membership: <span style={{ color: profile.isMember ? '#4ade80' : '#f87171' }}>
                  {profile.isMember ? 'Active' : 'Inactive'}
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
                Expires in: {profile.membershipExpiry}
              </p>
            </div>

            {/* Rental Tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div 
                onClick={() => setActiveModal('equipment')}
                style={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: '16px',
                  padding: '14px',
                  position: 'relative',
                  border: '1px solid #d1d5db',
                  height: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  position: 'absolute', top: '8px', right: '8px',
                  backgroundColor: '#86efac', color: '#064e3b',
                  fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '6px'
                }}>
                  {equipments} Available
                </span>
                <div style={{ height: '32px' }}></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111827' }}>Equipments</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Paddles & Balls</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveModal('court')}
                style={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: '16px',
                  padding: '14px',
                  position: 'relative',
                  border: '1px solid #d1d5db',
                  height: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  position: 'absolute', top: '8px', right: '8px',
                  backgroundColor: '#86efac', color: '#064e3b',
                  fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '6px'
                }}>
                  {openCourtsCount} Open
                </span>
                <div style={{ height: '32px' }}></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111827' }}>Courts</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Available Court</p>
                </div>
              </div>
            </div>

            {/* Play Match Action Bar */}
            {!isQueuing ? (
              <button 
                onClick={() => setActiveModal('matchmaking')}
                style={{
                  width: '100%',
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 0',
                  fontSize: '18px',
                  fontWeight: '800',
                  letterSpacing: '0.05em',
                  cursor: 'pointer'
                }}
              >
                PLAY MATCH
              </button>
            ) : (
              <div style={{
                width: '100%',
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                borderRadius: '16px',
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

          {/* Right Column */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>Game History</h3>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{matchHistory.length} Matches Logged</span>
            </div>

            <div style={{
              backgroundColor: '#e5e7eb',
              borderRadius: '16px',
              border: '1px solid #d1d5db',
              overflow: 'hidden',
              maxHeight: isDesktop ? '380px' : '180px',
              overflowY: 'auto'
            }}>
              {matchHistory.map((game, idx) => (
                <div key={game.id} style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: idx !== matchHistory.length - 1 ? '1px solid #d1d5db' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#cbd5e1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                    }}>
                      <img 
                        src={game.opponentAvatar} 
                        alt={game.opponentName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>{game.opponentName}</span>
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '6px',
                    backgroundColor: game.result === 'WIN' ? '#86efac' : '#fca5a5',
                    color: game.result === 'WIN' ? '#064e3b' : '#7f1d1d'
                  }}>
                    {game.result}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- NOTIFICATIONS MODAL --- */}
        {activeModal === 'notifications' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: isDesktop ? '24px' : '32px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 50
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '20px',
              width: '100%',
              maxWidth: '360px',
              maxHeight: '85%',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Pending Requests</h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                  }}
                >✕</button>
              </div>

              <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '30px 0' }}>
                    No pending notifications right now.
                  </p>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{notif.title}</span>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>{notif.timestamp}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#475569' }}>{notif.duration} • {notif.totalPrice}</span>
                        <span style={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '9999px'
                        }}>
                          {notif.status}
                        </span>
                      </div>

                      <button
                        onClick={() => cancelRequest(notif.id, notif.targetId, notif.itemType)}
                        style={{
                          marginTop: '10px',
                          width: '100%',
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
                        Cancel Request
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MATCH PLAY MODAL --- */}
        {activeModal === 'matchmaking' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: isDesktop ? '24px' : '32px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 50
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              maxWidth: '360px',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Match Play</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Random Matchmaking Queue</p>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
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
                    backgroundColor: playFormat === 'single' ? '#0f172a' : '#ffffff',
                    color: playFormat === 'single' ? '#ffffff' : '#0f172a',
                    border: '2px solid #0f172a',
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
                    backgroundColor: playFormat === 'double' ? '#0f172a' : '#ffffff',
                    color: playFormat === 'double' ? '#ffffff' : '#0f172a',
                    border: '2px solid #0f172a',
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
                  backgroundColor: '#4ade80',
                  color: '#064e3b',
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
                  backgroundColor: '#22c55e',
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

        {/* --- EQUIPMENTS RENTAL MODAL --- */}
        {activeModal === 'equipment' && (
          <EquipmentRentalModal 
            onClose={() => setActiveModal(null)} 
          />
        )}

        {/* --- COURTS RENTAL MODAL --- */}
        {activeModal === 'court' && (
          <CourtRentalModal 
            onClose={() => setActiveModal(null)} 
          />
        )}

      </div>
    </div>
  );
}