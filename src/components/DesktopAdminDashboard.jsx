// src/components/DesktopAdminDashboard.jsx
import React, { useState } from 'react';
import AdminManagementCards from './AdminManagementCards';
import SuperAdminSettingsModal from './SuperAdminSettingsModal';

export default function DesktopAdminDashboard({
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#ffffff', borderRadius: '20px', padding: '18px 24px', border: '1px solid #DBE64C'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#001F3F', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>⚙️</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#001F3F' }}>Super Admin Panel</h2>
            <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '3px 10px', borderRadius: '9999px', marginTop: '4px', display: 'inline-block' }}>Global Owner</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsSettingsOpen(true)}
            style={{ backgroundColor: '#F6F7ED', color: '#001F3F', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ⚙️ Settings
          </button>
          <button onClick={toggleRole} style={{ backgroundColor: '#001F3F', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
            {currentRole.toUpperCase()} VIEW
          </button>
        </div>
      </header>

      {/* 4 Choice Cards Grid */}
      <AdminManagementCards
        isDesktop={true}
        registeredPlayers={registeredPlayers}
        facilities={facilities}
        onAddFacility={onAddFacility}
        onToggleRentalService={onToggleRentalService}
        onToggleTenantService={onToggleTenantService}
      />

      {/* Activity Logs */}
      <section style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 18px 0', fontSize: '18px', fontWeight: '800', color: '#001F3F' }}>Facility Activity Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
          {systemLogs.map((log) => (
            <div key={log.id} style={{ padding: '14px 18px', backgroundColor: '#F6F7ED', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#001F3F' }}>{log.playerName}</span>
                  <span style={{ fontSize: '13px', color: '#1E488F' }}>• {log.title}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>{log.duration} at {log.timestamp}</span>
              </div>
              <span style={{ backgroundColor: '#DBE64C', color: '#001F3F', fontSize: '11px', fontWeight: '900', padding: '5px 12px', borderRadius: '9999px' }}>{log.status}</span>
            </div>
          ))}
        </div>
      </section>

      <SuperAdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDesktop={true}
        onLogout={toggleRole}
      />
    </div>
  );
}