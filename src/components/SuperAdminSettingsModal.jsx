// src/components/SuperAdminSettingsModal.jsx
import React, { useState } from 'react';

export default function SuperAdminSettingsModal({ isOpen, onClose, isDesktop, onLogout }) {
  const [adminName, setAdminName] = useState('Ball Tickler');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleProfileSave = (e) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Super Admin profile updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 31, 63, 0.88)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '16px', zIndex: 140
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '24px', padding: isDesktop ? '32px' : '20px',
        width: '100%', maxWidth: isDesktop ? '540px' : '380px', maxHeight: '90vh',
        overflowY: 'auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px',
        border: '2px solid #DBE64C'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#001F3F' }}>
              ⚙️ Super Admin Settings
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#1E488F' }}>System configuration & account security</p>
          </div>
          <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#ef4444', color: '#ffffff', cursor: 'pointer', fontWeight: '800' }}>✕</button>
        </div>

        {message && (
          <div style={{
            padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800',
            backgroundColor: message.type === 'success' ? '#DBE64C' : '#fee2e2',
            color: message.type === 'success' ? '#001F3F' : '#991b1b'
          }}>
            {message.text}
          </div>
        )}

        {/* Profile Settings */}
        <form onSubmit={handleProfileSave} style={{ backgroundColor: '#F6F7ED', padding: '16px', borderRadius: '16px', border: '1px solid #1E488F', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Profile Settings</h4>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>SUPER ADMIN NAME</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#001F3F', color: '#DBE64C', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
            Save Profile
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange} style={{ backgroundColor: '#F6F7ED', padding: '16px', borderRadius: '16px', border: '1px solid #1E488F', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>Change Password</h4>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>CURRENT PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>NEW PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#001F3F', display: 'block', marginBottom: '4px' }}>CONFIRM NEW PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #1E488F', backgroundColor: '#ffffff', fontSize: '13px', boxSizing: 'border-box', color: '#001F3F' }}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#001F3F', color: '#DBE64C', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
            Update Password
          </button>
        </form>

        <div style={{ paddingTop: '8px', borderTop: '1px solid #DBE64C' }}>
          <button
            onClick={onLogout}
            style={{ width: '100%', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px 0', fontSize: '13px', fontWeight: '900', cursor: 'pointer' }}
          >
            🚪 Log Out Super Admin
          </button>
        </div>
      </div>
    </div>
  );
}