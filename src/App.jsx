// src/App.jsx
import React from 'react';
import { useApp } from './context/AppContext';
import AdminDashboard from './components/AdminDashboard';
import FacilityDashboard from './components/FacilityDashboard';
import PlayerDashboard from './components/PlayerDashboard';

export default function App() {
  const { currentRole } = useApp();

  return (
    <div style={{ backgroundColor: '#74C365', minHeight: '100vh', padding: '16px' }}>
      {currentRole === 'admin' && <AdminDashboard />}
      {currentRole === 'facility' && <FacilityDashboard />}
      {currentRole === 'player' && <PlayerDashboard />}
    </div>
  );
}