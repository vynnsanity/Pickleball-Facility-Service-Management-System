// src/components/PlayerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DesktopPlayerDashboard from './DesktopPlayerDashboard';
import MobilePlayerDashboard from './MobilePlayerDashboard';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
}

export default function PlayerDashboard() {
  const isDesktop = useIsDesktop();
  const appData = useApp();

  const [activeModal, setActiveModal] = useState(null);
  const [playFormat, setPlayFormat] = useState('single');
  const [rentDuration, setRentDuration] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

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
      appData.rentItem(selectedItem.id, rentDuration);
      setSelectedItem(null);
      setActiveModal(null);
    }
  };

  const confirmBooking = () => {
    if (selectedItem) {
      appData.bookCourt(selectedItem.id, rentDuration);
      setSelectedItem(null);
      setActiveModal(null);
    }
  };

  const sharedProps = {
    ...appData,
    activeModal,
    setActiveModal,
    playFormat,
    setPlayFormat,
    rentDuration,
    setRentDuration,
    selectedItem,
    setSelectedItem,
    formatTimer,
    pendingNotifsCount: appData.notifications.length
  };

  return (
    <>
      {isDesktop ? (
        <DesktopPlayerDashboard {...sharedProps} />
      ) : (
        <MobilePlayerDashboard {...sharedProps} />
      )}

      {/* ENLARGED MODALS (WEBSITE VIEW: maxWidth 580px - 620px) */}

      {/* 1. MATCH PLAY FORMAT MODAL */}
      {activeModal === 'matchmaking' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '24px', 
            padding: isDesktop ? '32px' : '24px', 
            width: '100%', 
            maxWidth: isDesktop ? '580px' : '360px', 
            boxSizing: 'border-box' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: isDesktop ? '24px' : '20px', fontWeight: '900', color: '#001F3F' }}>Match Play</h3>
                <span style={{ fontSize: isDesktop ? '13px' : '11px', color: '#1E488F', fontWeight: '600' }}>Random Matchmaking Queue</span>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <span style={{ fontSize: isDesktop ? '13px' : '11px', fontWeight: '900', color: '#001F3F', display: 'block', marginBottom: '12px' }}>CHOOSE PLAY FORMAT</span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <button type="button" onClick={() => setPlayFormat('single')} style={{ backgroundColor: playFormat === 'single' ? '#001F3F' : '#ffffff', color: playFormat === 'single' ? '#ffffff' : '#001F3F', border: '2px solid #001F3F', borderRadius: '18px', padding: isDesktop ? '18px 16px' : '14px 12px', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ fontSize: isDesktop ? '18px' : '15px', fontWeight: '800', display: 'block' }}>Single</span>
                <span style={{ fontSize: '12px', color: playFormat === 'single' ? '#DBE64C' : '#64748b' }}>1 vs 1 Duel</span>
              </button>

              <button type="button" onClick={() => setPlayFormat('double')} style={{ backgroundColor: playFormat === 'double' ? '#001F3F' : '#ffffff', color: playFormat === 'double' ? '#ffffff' : '#001F3F', border: '2px solid #001F3F', borderRadius: '18px', padding: isDesktop ? '18px 16px' : '14px 12px', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ fontSize: isDesktop ? '18px' : '15px', fontWeight: '800', display: 'block' }}>Double</span>
                <span style={{ fontSize: '12px', color: playFormat === 'double' ? '#DBE64C' : '#64748b' }}>2 vs 2 Team</span>
              </button>
            </div>

            <div style={{ backgroundColor: '#F6F7ED', borderRadius: '16px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #DBE64C', marginBottom: '20px' }}>
              <span style={{ fontSize: isDesktop ? '15px' : '13px', fontWeight: '700', color: '#001F3F' }}>Your MMR Rating:</span>
              <span style={{ backgroundColor: '#001F3F', color: '#DBE64C', fontSize: isDesktop ? '14px' : '12px', fontWeight: '900', padding: '4px 14px', borderRadius: '9999px' }}>
                {appData.profile.mmr} MMR
              </span>
            </div>

            <button type="button" onClick={() => { setActiveModal(null); appData.startQueue(playFormat); }} style={{ width: '100%', backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '18px', padding: '16px 0', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 128, 76, 0.3)' }}>
              MATCH NOW
            </button>
          </div>
        </div>
      )}

      {/* 2. MATCH FOUND MODAL */}
      {appData.matchFoundModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '36px 32px' : '28px 24px', width: '100%', maxWidth: isDesktop ? '580px' : '360px', textAlign: 'center', boxSizing: 'border-box' }}>
            <span style={{ display: 'inline-block', backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '12px', fontWeight: '900', padding: '6px 16px', borderRadius: '9999px', marginBottom: '14px' }}>MATCH FOUND</span>
            <h3 style={{ margin: '0 0 8px 0', fontSize: isDesktop ? '26px' : '20px', fontWeight: '900', color: '#001F3F' }}>vs {appData.matchFoundModal.opponentName}</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: isDesktop ? '15px' : '13px', color: '#1E488F' }}>Please proceed to <strong>{appData.matchFoundModal.courtName}</strong> for your match.</p>
            <button onClick={() => appData.setMatchFoundModal(null)} style={{ width: '100%', backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '16px', padding: '16px 0', fontSize: '15px', fontWeight: '900', cursor: 'pointer' }}>PROCEED TO COURT</button>
          </div>
        </div>
      )}

      {/* 3. NOTIFICATIONS MODAL */}
      {activeModal === 'notifications' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px', width: '100%', maxWidth: isDesktop ? '620px' : '380px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Pending & Updates</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appData.notifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: '30px 0' }}>No notifications right now.</p>
              ) : (
                appData.notifications.map(notif => (
                  <div key={notif.id} style={{ backgroundColor: '#F6F7ED', border: '1px solid #e2e8f0', borderRadius: '16px', padding: isDesktop ? '16px 20px' : '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: isDesktop ? '15px' : '13px', fontWeight: '800', color: '#001F3F' }}>{notif.title}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{notif.timestamp}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: isDesktop ? '13px' : '11px', color: '#1E488F' }}>{notif.duration} • {notif.totalPrice}</span>
                      <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '9999px' }}>{notif.status}</span>
                    </div>
                    <button onClick={() => appData.dismissNotification(notif.id, notif.targetId, notif.itemType, notif.status === 'Pending Approval')} style={{ marginTop: '12px', width: '100%', backgroundColor: '#001F3F', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 0', fontSize: isDesktop ? '13px' : '11px', fontWeight: '800', cursor: 'pointer' }}>
                      Dismiss Notification
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. AVAILABLE EQUIPMENT MODAL */}
      {activeModal === 'inventory' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px', width: '100%', maxWidth: isDesktop ? '620px' : '380px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Available Equipment</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appData.inventory.map(item => (
                <div key={item.id} style={{ backgroundColor: '#F6F7ED', border: '1px solid #e2e8f0', borderRadius: '16px', padding: isDesktop ? '16px 20px' : '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: isDesktop ? '16px' : '13px', fontWeight: '800', color: '#001F3F', display: 'block' }}>{item.name}</span>
                    <span style={{ fontSize: isDesktop ? '13px' : '10px', color: '#1E488F' }}>₱{item.baseRate}/hr • {item.condition}</span>
                    {item.desc && <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>{item.desc}</p>}
                  </div>
                  <button disabled={item.isRented || item.isPending} onClick={() => handleRentClick(item)} style={{ backgroundColor: item.isRented || item.isPending ? '#e2e8f0' : '#00804C', color: item.isRented || item.isPending ? '#94a3b8' : '#ffffff', border: 'none', borderRadius: '12px', padding: isDesktop ? '10px 20px' : '6px 12px', fontSize: isDesktop ? '13px' : '11px', fontWeight: '800', cursor: item.isRented || item.isPending ? 'not-allowed' : 'pointer' }}>
                    {item.isPending ? 'Pending' : item.isRented ? 'Occupied' : 'Rent Item'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. COURT AVAILABILITY MODAL */}
      {activeModal === 'courts' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px', width: '100%', maxWidth: isDesktop ? '620px' : '380px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Court Availability</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {appData.courts.map(court => (
                <div key={court.id} style={{ backgroundColor: '#F6F7ED', border: '1px solid #e2e8f0', borderRadius: '16px', padding: isDesktop ? '16px 20px' : '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: isDesktop ? '16px' : '13px', fontWeight: '800', color: '#001F3F', display: 'block' }}>{court.name}</span>
                    <span style={{ fontSize: isDesktop ? '13px' : '10px', color: '#1E488F' }}>{court.type} • ₱{court.baseRate}/hr</span>
                    {court.surface && <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>{court.surface}</p>}
                  </div>
                  <button disabled={!court.open || court.isPending} onClick={() => handleCourtClick(court)} style={{ backgroundColor: !court.open || court.isPending ? '#e2e8f0' : '#00804C', color: !court.open || court.isPending ? '#94a3b8' : '#ffffff', border: 'none', borderRadius: '12px', padding: isDesktop ? '10px 20px' : '6px 12px', fontSize: isDesktop ? '13px' : '11px', fontWeight: '800', cursor: !court.open || court.isPending ? 'not-allowed' : 'pointer' }}>
                    {court.isPending ? 'Pending' : !court.open ? 'Occupied' : 'Book Court'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. RENT CONFIRMATION MODAL (ENLARGED) */}
      {activeModal === 'rentConfirm' && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '36px 32px' : '24px', width: '100%', maxWidth: isDesktop ? '580px' : '360px', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Rent {selectedItem.name}</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: isDesktop ? '14px' : '12px', color: '#1E488F' }}>Base Rate: ₱{selectedItem.baseRate}/hr</p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: isDesktop ? '12px' : '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '8px' }}>SELECT DURATION (HOURS)</label>
              <select value={rentDuration} onChange={(e) => setRentDuration(Number(e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #1E488F', fontSize: '15px', outline: 'none' }}>
                <option value={1}>1 Hour - ₱{selectedItem.baseRate * 1}</option>
                <option value={2}>2 Hours - ₱{selectedItem.baseRate * 2}</option>
                <option value={3}>3 Hours - ₱{selectedItem.baseRate * 3}</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={confirmRental} style={{ flex: 1, backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '16px 0', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>Submit Request</button>
              <button onClick={() => setActiveModal('inventory')} style={{ flex: 1, backgroundColor: '#F6F7ED', color: '#001F3F', border: 'none', borderRadius: '14px', padding: '16px 0', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>Back</button>
            </div>
          </div>
        </div>
      )}

      {/* 7. COURT CONFIRMATION MODAL (ENLARGED) */}
      {activeModal === 'courtConfirm' && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 110 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '36px 32px' : '24px', width: '100%', maxWidth: isDesktop ? '580px' : '360px', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Book {selectedItem.name}</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: isDesktop ? '14px' : '12px', color: '#1E488F' }}>{selectedItem.type} • ₱{selectedItem.baseRate}/hr</p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: isDesktop ? '12px' : '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '8px' }}>SELECT DURATION (HOURS)</label>
              <select value={rentDuration} onChange={(e) => setRentDuration(Number(e.target.value))} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #1E488F', fontSize: '15px', outline: 'none' }}>
                <option value={1}>1 Hour - ₱{selectedItem.baseRate * 1}</option>
                <option value={2}>2 Hours - ₱{selectedItem.baseRate * 2}</option>
                <option value={3}>3 Hours - ₱{selectedItem.baseRate * 3}</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={confirmBooking} style={{ flex: 1, backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '16px 0', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>Submit Booking</button>
              <button onClick={() => setActiveModal('courts')} style={{ flex: 1, backgroundColor: '#F6F7ED', color: '#001F3F', border: 'none', borderRadius: '14px', padding: '16px 0', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}>Back</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}