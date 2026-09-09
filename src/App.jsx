import React from 'react';
import { useApp } from './context/AppContext';
import AppLayout from './components/AppLayout';
import PlayerDashboard from './components/PlayerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ConfirmationModal from './components/ConfirmationModal';

export default function App() {
  const { currentRole } = useApp();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F6F7ED',
      color: '#001F3F',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box'
    }}>
      <AppLayout>
        {currentRole === 'player' ? (
          <PlayerDashboard />
        ) : (
          <AdminDashboard />
        )}
      </AppLayout>

      <ConfirmationModal />
    </div>
  );
}