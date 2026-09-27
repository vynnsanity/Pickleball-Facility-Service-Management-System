// src/components/MobileAdminDashboard.jsx
import React, { useState } from 'react';
import AdminManagementCards from './AdminManagementCards';
import SuperAdminSettingsModal from './SuperAdminSettingsModal';

export default function MobileAdminDashboard({
  systemLogs,
  registeredPlayers,
  facilities,
  onAddFacility,
  onToggleRentalService,
  onToggleTenantService,
  currentRole,
  toggleRole
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Super Admin Header Bar */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #DBE64C' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#001F3F', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚙️</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Super Admin</h2>
            <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '10px', fontWeight: '900', padding: '2px 8px', borderRadius: '9999px' }}>Global Owner</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsSettingsOpen(true)}
            style={{ backgroundColor: '#F6F7ED', border: '1px solid #1E488F', color: '#001F3F', width: '38px', height: '38px', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}
          >
            ⚙️
          </button>
          <button onClick={toggleRole} style={{ backgroundColor: '#001F3F', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
            {currentRole}
          </button>
        </div>
      </div>

      {/* 4 Choice Cards */}
      <AdminManagementCards
        isDesktop={false}
        registeredPlayers={registeredPlayers}
        facilities={facilities}
        onAddFacility={onAddFacility}
        onToggleRentalService={onToggleRentalService}
        onToggleTenantService={onToggleTenantService}
      />

      {/* Facility Activity Logs */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '16px', border: '1px solid #DBE64C' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '800', color: '#001F3F' }}>Facility Activity Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
          {systemLogs.map((log) => (
            <div key={log.id} style={{ padding: '12px', backgroundColor: '#F6F7ED', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #1E488F' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#001F3F' }}>{log.playerName}</span>
                <span style={{ backgroundColor: '#00804C', color: '#ffffff', fontSize: '9px', fontWeight: '900', padding: '2px 6px', borderRadius: '9999px' }}>{log.status}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#1E488F', fontWeight: '700' }}>{log.title}</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>{log.duration} • {log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      <SuperAdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDesktop={false}
        onLogout={toggleRole}
      />
    </div>
  );
}