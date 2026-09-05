// src/App.jsx
import React from 'react';
import { useApp } from './context/AppContext';
import PlayerDashboard from './components/PlayerDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const { currentRole } = useApp();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d1527', // Deep Navy Backdrop
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box'
    }}>
      <main style={{ minHeight: '100vh', width: '100%' }}>
        {currentRole === 'player' ? (
          <PlayerDashboard />
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}