// src/components/AdminDashboard.jsx
import React from 'react';
import { useApp } from '../context/AppContext';
import DesktopAdminDashboard from './DesktopAdminDashboard';
import MobileAdminDashboard from './MobileAdminDashboard';

export default function AdminDashboard({ isDesktop, setActiveModal }) {
  const {
    systemLogs,
    registeredPlayers,
    facilities,
    addFacility,
    toggleFacilityCoachingService,
    toggleFacilityTenantService,
    currentRole,
    toggleRole
  } = useApp();

  return isDesktop ? (
    <DesktopAdminDashboard
      systemLogs={systemLogs}
      registeredPlayers={registeredPlayers}
      facilities={facilities}
      onAddFacility={addFacility}
      onToggleCoachingService={toggleFacilityCoachingService}
      onToggleTenantService={toggleFacilityTenantService}
      currentRole={currentRole}
      toggleRole={toggleRole}
      setActiveModal={setActiveModal}
    />
  ) : (
    <MobileAdminDashboard
      systemLogs={systemLogs}
      registeredPlayers={registeredPlayers}
      facilities={facilities}
      onAddFacility={addFacility}
      onToggleCoachingService={toggleFacilityCoachingService}
      onToggleTenantService={toggleFacilityTenantService}
      currentRole={currentRole}
      toggleRole={toggleRole}
      setActiveModal={setActiveModal}
    />
  );
}