// src/components/FacilityDashboard.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FacilityDashboard() {
  const {
    inventory,
    setInventory,
    courts,
    setCourts,
    notifications,
    approveRequest,
    rejectRequest,
    currentRole,
    toggleRole,
    activeModal,
    setActiveModal
  } = useApp();

  const safeInventory = inventory || [];
  const safeCourts = courts || [];
  const safeNotifications = notifications || [];

  const pendingNotifications = safeNotifications.filter(n => n.status === 'Pending Approval');
  const availableEquipmentsCount = safeInventory.filter(item => !item.isRented && !item.isPending).length;
  const openCourtsCount = safeCourts.filter(c => c.open && !c.isPending).length;

  // New Equipment Form State
  const [eqName, setEqName] = useState('');
  const [eqRate, setEqRate] = useState('');
  const [eqCondition, setEqCondition] = useState('Excellent');

  // New Court Form State
  const [courtName, setCourtName] = useState('');
  const [courtType, setCourtType] = useState('Indoor');
  const [courtRate, setCourtRate] = useState('');
  const [courtSurface, setCourtSurface] = useState('Pro Cushion Hardcourt');

  // Facility Settings Form State
  const [facilityName, setFacilityName] = useState('Metro Pickleball Hub');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsMessage, setSettingsMessage] = useState(null);

  const handleAddEquipmentSubmit = (e) => {
    e.preventDefault();
    if (!eqName.trim() || !eqRate) return;

    const newItem = {
      id: `eq-${Date.now()}`,
      name: eqName.trim(),
      baseRate: Number(eqRate),
      condition: eqCondition,
      isRented: false,
      isPending: false,
      desc: `${eqCondition} condition rental gear.`
    };

    setInventory(prev => [newItem, ...prev]);
    setEqName('');
    setEqRate('');
    setEqCondition('Excellent');
    setActiveModal(null);
  };

  const handleAddCourtSubmit = (e) => {
    e.preventDefault();
    if (!courtName.trim() || !courtRate) return;

    const newCourt = {
      id: `c-${Date.now()}`,
      name: courtName.trim(),
      type: courtType,
      surface: courtSurface,
      baseRate: Number(courtRate),
      open: true,
      isPending: false
    };

    setCourts(prev => [newCourt, ...prev]);
    setCourtName('');
    setCourtRate('');
    setActiveModal(null);
  };

  const handleSettingsProfileSave = (e) => {
    e.preventDefault();
    setSettingsMessage({ type: 'success', text: 'Facility profile updated successfully!' });
    setTimeout(() => setSettingsMessage(null), 3000);
  };

  const handleSettingsPasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSettingsMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSettingsMessage({ type: 'success', text: 'Password changed successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSettingsMessage(null), 3000);
  };

  const toggleCourtStatus = (courtId) => {
    setCourts(prev => prev.map(c => c.id === courtId ? { ...c, open: !c.open } : c));
  };

  const toggleEquipmentStatus = (eqId) => {
    setInventory(prev => prev.map(i => i.id === eqId ? { ...i, isRented: !i.isRented } : i));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
      
      {/* 1. Header Card with Centered Gear Icon & Settings Trigger */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #DBE64C'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            backgroundColor: '#001F3F',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: '800',
            flexShrink: 0
          }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1', width: '100%', height: '100%' }}>
              ⚙️
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#001F3F', lineHeight: '1.1' }}>
              Facility
            </h2>
            <span style={{
              backgroundColor: '#DBE64C',
              color: '#001F3F',
              fontSize: '10px',
              fontWeight: '900',
              padding: '2px 8px',
              borderRadius: '9999px',
              alignSelf: 'flex-start'
            }}>
              Venue Manager
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveModal('facilitySettings')}
            style={{
              backgroundColor: '#F6F7ED',
              border: '1px solid #1E488F',
              color: '#001F3F',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ⚙️
          </button>
          
          <button
            onClick={toggleRole}
            style={{
              backgroundColor: '#001F3F',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {currentRole}
          </button>
        </div>
      </div>

      {/* 2. Review Requests Banner */}
      <button
        onClick={() => setActiveModal('requests')}
        style={{
          width: '100%',
          backgroundColor: '#001F3F',
          color: '#ffffff',
          border: pendingNotifications.length > 0 ? '2px solid #ef4444' : '1px solid #DBE64C',
          borderRadius: '20px',
          padding: '18px',
          fontSize: '16px',
          fontWeight: '900',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>REVIEW REQUESTS ({pendingNotifications.length})</span>
        <span style={{
          backgroundColor: '#DBE64C',
          color: '#001F3F',
          fontSize: '11px',
          padding: '4px 10px',
          borderRadius: '8px',
          fontWeight: '800'
        }}>
          Manage Bookings
        </span>
      </button>

      {/* 3. Manage Inventory & Manage Courts Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div
          onClick={() => setActiveModal('inventory')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '16px',
            height: '110px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#DBE64C',
            color: '#001F3F',
            fontSize: '10px',
            fontWeight: '900',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            {availableEquipmentsCount} Free
          </span>
          <div style={{ fontSize: '26px' }}>🏓</div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#001F3F' }}>
            Manage Inventory
          </h4>
        </div>

        <div
          onClick={() => setActiveModal('courts')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '16px',
            height: '110px',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            position: 'relative',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#DBE64C',
            color: '#001F3F',
            fontSize: '10px',
            fontWeight: '900',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            {openCourtsCount} Open
          </span>
          <div style={{ fontSize: '26px' }}>🏟️</div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#001F3F' }}>
            Manage Courts
          </h4>
        </div>
      </div>

      {/* 4. Full-Width Add Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button
          onClick={() => setActiveModal('addEquipment')}
          style={{
            backgroundColor: '#00804C',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '16px 0',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer'
          }}
        >
          + Add Equipment
        </button>

        <button
          onClick={() => setActiveModal('addCourt')}
          style={{
            backgroundColor: '#00804C',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '16px 0',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer'
          }}
        >
          + Add Court
        </button>
      </div>

      {/* 5. Facility Activity Logs */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 31, 63, 0.08)'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>
          Facility Activity Logs
        </h3>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '20px 0' }}>
          No active facility activity logs.
        </p>
      </div>

      {/* ==================== MODAL OVERLAYS ==================== */}

      {/* MODAL: FACILITY SETTINGS */}
      {activeModal === 'facilitySettings' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 140 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid #DBE64C' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>⚙️ Facility Settings</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#1E488F' }}>Venue profile & account security</p>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            {settingsMessage && (
              <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', backgroundColor: settingsMessage.type === 'success' ? '#DBE64C' : '#fee2e2', color: settingsMessage.type === 'success' ? '#001F3F' : '#991b1b' }}>
                {settingsMessage.text}
              </div>
            )}

            <form onSubmit={handleSettingsProfileSave} style={{ backgroundColor: '#F6F7ED', padding: '16px', borderRadius: '16px', border: '1px solid #1E488F', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Venue Profile</h4>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>FACILITY NAME</label>
                <input type="text" value={facilityName} onChange={e => setFacilityName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#001F3F', color: '#DBE64C', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Save Profile</button>
            </form>

            <form onSubmit={handleSettingsPasswordChange} style={{ backgroundColor: '#F6F7ED', padding: '16px', borderRadius: '16px', border: '1px solid #1E488F', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Change Password</h4>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>CURRENT PASSWORD</label>
                <input type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>NEW PASSWORD</label>
                <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>CONFIRM NEW PASSWORD</label>
                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#001F3F', color: '#DBE64C', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Update Password</button>
            </form>

            <button onClick={() => { setActiveModal(null); toggleRole(); }} style={{ width: '100%', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '900', cursor: 'pointer' }}>
              🚪 Log Out Facility
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: REVIEW REQUESTS */}
      {activeModal === 'requests' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '2px solid #DBE64C' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Pending Requests ({pendingNotifications.length})</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingNotifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '30px 0' }}>No pending court or gear requests.</p>
              ) : (
                pendingNotifications.map(req => (
                  <div key={req.id} style={{ padding: '14px', backgroundColor: '#F6F7ED', borderRadius: '16px', border: '1px solid #1E488F', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{req.title}</span>
                      <span style={{ fontSize: '10px', color: '#1E488F', fontWeight: '700' }}>{req.timestamp}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#00804C', fontWeight: '700' }}>Requested by {req.playerName} • {req.duration} ({req.totalPrice})</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                      <button onClick={() => approveRequest(req.id, req.targetId, req.itemType)} style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => rejectRequest(req.id, req.targetId, req.itemType)} style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE INVENTORY */}
      {activeModal === 'inventory' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '2px solid #DBE64C' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Manage Equipment Inventory</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {safeInventory.map(item => (
                <div key={item.id} style={{ padding: '12px 14px', backgroundColor: '#F6F7ED', borderRadius: '14px', border: '1px solid #1E488F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{item.name}</h4>
                    <span style={{ fontSize: '11px', color: '#1E488F' }}>₱{item.baseRate}/hr • {item.condition}</span>
                  </div>
                  <button onClick={() => toggleEquipmentStatus(item.id)} style={{ backgroundColor: item.isRented ? '#ef4444' : '#00804C', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                    {item.isRented ? 'Mark Available' : 'Mark Occupied'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MANAGE COURTS */}
      {activeModal === 'courts' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '2px solid #DBE64C' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Manage Facility Courts</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {safeCourts.map(court => (
                <div key={court.id} style={{ padding: '12px 14px', backgroundColor: '#F6F7ED', borderRadius: '14px', border: '1px solid #1E488F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{court.name}</h4>
                    <span style={{ fontSize: '11px', color: '#1E488F' }}>{court.type} • ₱{court.baseRate}/hr</span>
                  </div>
                  <button onClick={() => toggleCourtStatus(court.id)} style={{ backgroundColor: court.open ? '#00804C' : '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                    {court.open ? 'Set Occupied' : 'Set Open'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD EQUIPMENT */}
      {activeModal === 'addEquipment' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '380px', boxSizing: 'border-box', border: '2px solid #DBE64C' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>+ Add New Equipment</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>EQUIPMENT NAME</label>
                <input type="text" placeholder="e.g. Pro Paddle Set C" value={eqName} onChange={e => setEqName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>HOURLY RATE (₱)</label>
                <input type="number" placeholder="100" value={eqRate} onChange={e => setEqRate(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>CONDITION</label>
                <select value={eqCondition} onChange={e => setEqCondition(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }}>
                  <option value="Brand New">Brand New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                </select>
              </div>
              <button type="submit" style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', marginTop: '6px' }}>Save Equipment</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD COURT */}
      {activeModal === 'addCourt' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 31, 63, 0.88)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 120 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '380px', boxSizing: 'border-box', border: '2px solid #DBE64C' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>+ Add New Court</h3>
              <button onClick={() => setActiveModal(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            <form onSubmit={handleAddCourtSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>COURT NAME</label>
                <input type="text" placeholder="e.g. Court 6" value={courtName} onChange={e => setCourtName(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>COURT TYPE</label>
                <select value={courtType} onChange={e => setCourtType(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }}>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Covered">Covered</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>HOURLY RATE (₱)</label>
                <input type="number" placeholder="250" value={courtRate} onChange={e => setCourtRate(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#F6F7ED', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#00804C', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', marginTop: '6px' }}>Save Court</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}