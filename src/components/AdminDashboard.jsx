// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DesktopAdminDashboard from './DesktopAdminDashboard';
import MobileAdminDashboard from './MobileAdminDashboard';

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

export default function AdminDashboard() {
  const isDesktop = useIsDesktop();
  const appData = useApp();
  const { 
    notifications, systemLogs, approveRequest, rejectRequest, 
    courts, setCourts, inventory, setInventory,
    currentRole, toggleRole, showAlert,
    activeMatch, resolveMatchResult
  } = appData;

  const [activeModal, setActiveModal] = useState(null);

  // Form states for Equipment
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState('Paddles');
  const [eqRate, setEqRate] = useState(100);
  const [eqDesc, setEqDesc] = useState('');

  // Form states for Courts
  const [courtName, setCourtName] = useState('');
  const [courtType, setCourtType] = useState('Indoor');
  const [courtSurface, setCourtSurface] = useState('Pro Cushion Hardcourt');
  const [courtRate, setCourtRate] = useState(250);
  const [courtDesc, setCourtDesc] = useState('');

  const pendingNotifications = notifications.filter(n => n.status === 'Pending Approval');
  const hasPending = pendingNotifications.length > 0;
  const openCourtsCount = courts.filter(c => c.open && !c.isPending).length;
  const availableEquipmentsCount = inventory.filter(item => !item.isRented && !item.isPending).length;

  const toggleCourtStatus = (courtId) => {
    setCourts(prev => prev.map(c => c.id === courtId ? { ...c, open: !c.open, isPending: false } : c));
  };

  const toggleEquipmentStatus = (itemId) => {
    setInventory(prev => prev.map(item => item.id === itemId ? { ...item, isRented: !item.isRented, isPending: false } : item));
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    if (!eqName.trim()) return;

    const newItem = {
      id: `custom-eq-${Date.now()}`,
      name: eqName,
      brand: 'PRO',
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
    setEqRate(100);
    setEqDesc('');
    showAlert('Equipment Added', `${newItem.name} added at ₱${newItem.baseRate}/hr.`, 'success');
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
    setCourtRate(250);
    setCourtDesc('');
    showAlert('Court Added', `${newCourt.name} added at ₱${newCourt.baseRate}/hr.`, 'success');
  };

  const sharedAdminProps = {
    ...appData,
    activeModal,
    setActiveModal,
    hasPending,
    openCourtsCount,
    availableEquipmentsCount,
    toggleCourtStatus,
    toggleEquipmentStatus
  };

  return (
    <>
      {isDesktop ? (
        <DesktopAdminDashboard {...sharedAdminProps} />
      ) : (
        <MobileAdminDashboard {...sharedAdminProps} />
      )}

      {/* ADMIN MODALS */}
      {activeModal === 'requests' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px', width: '100%', maxWidth: isDesktop ? '620px' : '380px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Admin Approvals</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingNotifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: '30px 0' }}>No pending user requests.</p>
              ) : (
                pendingNotifications.map(notif => (
                  <div key={notif.id} style={{ backgroundColor: '#F6F7ED', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: isDesktop ? '15px' : '13px', fontWeight: '800', color: '#001F3F' }}>{notif.playerName ? `${notif.playerName} - ${notif.title}` : notif.title}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{notif.timestamp}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button onClick={() => approveRequest(notif.id, notif.targetId, notif.itemType)} style={{ flex: 1, backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => rejectRequest(notif.id, notif.targetId, notif.itemType)} style={{ flex: 1, backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 0', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'inventory' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px', width: '100%', maxWidth: isDesktop ? '620px' : '380px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Inventory Status</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {inventory.map(item => (
                <div key={item.id} style={{ backgroundColor: '#F6F7ED', border: '1px solid #e2e8f0', borderRadius: '16px', padding: isDesktop ? '16px 20px' : '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: isDesktop ? '16px' : '13px', fontWeight: '800', color: '#001F3F', display: 'block' }}>{item.name}</span>
                    <span style={{ fontSize: isDesktop ? '13px' : '10px', color: '#1E488F' }}>₱{item.baseRate}/hr • {item.condition}</span>
                  </div>
                  <button onClick={() => toggleEquipmentStatus(item.id)} style={{ backgroundColor: item.isRented || item.isPending ? '#fee2e2' : '#DBE64C', color: item.isRented || item.isPending ? '#991b1b' : '#001F3F', border: 'none', borderRadius: '10px', padding: isDesktop ? '10px 20px' : '6px 12px', fontSize: isDesktop ? '13px' : '11px', fontWeight: '800', cursor: 'pointer' }}>
                    {item.isPending ? 'Pending' : item.isRented ? 'Occupied' : 'Available'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'courts' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px', width: '100%', maxWidth: isDesktop ? '620px' : '380px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Courts Status</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {courts.map(court => (
                <div key={court.id} style={{ backgroundColor: '#F6F7ED', border: '1px solid #e2e8f0', borderRadius: '16px', padding: isDesktop ? '16px 20px' : '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: isDesktop ? '16px' : '13px', fontWeight: '800', color: '#001F3F', display: 'block' }}>{court.name}</span>
                    <span style={{ fontSize: isDesktop ? '13px' : '10px', color: '#1E488F' }}>{court.type} • ₱{court.baseRate}/hr</span>
                  </div>
                  <button onClick={() => toggleCourtStatus(court.id)} style={{ backgroundColor: court.open && !court.isPending ? '#DBE64C' : '#fee2e2', color: court.open && !court.isPending ? '#001F3F' : '#991b1b', border: 'none', borderRadius: '10px', padding: isDesktop ? '10px 20px' : '6px 12px', fontSize: isDesktop ? '13px' : '11px', fontWeight: '800', cursor: 'pointer' }}>
                    {court.isPending ? 'Pending' : !court.open ? 'Occupied' : 'Open'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'addEquipment' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '24px', width: '100%', maxWidth: isDesktop ? '580px' : '380px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Add New Equipment</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>
            <form onSubmit={handleAddEquipment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>EQUIPMENT NAME</label>
                <input type="text" placeholder="e.g. Paddle Pair F" value={eqName} onChange={(e) => setEqName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>CATEGORY</label>
                  <select value={eqCategory} onChange={(e) => setEqCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px' }}>
                    <option value="Paddles">Paddles</option>
                    <option value="Balls">Balls</option>
                    <option value="Machines">Machines</option>
                    <option value="Nets">Nets</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>HOURLY RATE (₱)</label>
                  <input type="number" placeholder="100" value={eqRate} onChange={(e) => setEqRate(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>DESCRIPTION</label>
                <textarea placeholder="e.g. Professional carbon fiber pickleball paddle pair." value={eqDesc} onChange={(e) => setEqDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit' }} />
              </div>

              <button type="submit" style={{ marginTop: '10px', backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '16px 0', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,128,76,0.3)' }}>SAVE EQUIPMENT</button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'addCourt' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '24px', width: '100%', maxWidth: isDesktop ? '580px' : '380px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>Add New Court</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}>✕</button>
            </div>
            <form onSubmit={handleAddCourt} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>COURT NAME</label>
                <input type="text" placeholder="e.g. Court 6" value={courtName} onChange={(e) => setCourtName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>TYPE</label>
                  <select value={courtType} onChange={(e) => setCourtType(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px' }}>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Covered">Covered</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>HOURLY RATE (₱)</label>
                  <input type="number" placeholder="250" value={courtRate} onChange={(e) => setCourtRate(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>SURFACE TYPE</label>
                <input type="text" placeholder="e.g. Pro Cushion Hardcourt" value={courtSurface} onChange={(e) => setCourtSurface(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>DESCRIPTION</label>
                <textarea placeholder="e.g. Premium indoor pickleball court with LED lighting." value={courtDesc} onChange={(e) => setCourtDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E488F', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'inherit' }} />
              </div>

              <button type="submit" style={{ marginTop: '10px', backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '16px 0', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,128,76,0.3)' }}>SAVE COURT</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}