// src/App.jsx
import React from 'react';
import { useApp } from './context/AppContext';
import PlayerDashboard from './components/PlayerDashboard';

export default function App() {
  const { currentRole, toggleRole, viewType, toggleViewType } = useApp();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Bar */}
      <header style={{
        padding: '12px 24px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.05em' }}>
            Pickleball Service Management - Perez, Vicuña, Avila
          </h1>
          <span style={{ fontSize: '16px', color: '#94a3b8' }}>Simulation</span>
        </div>

        {/* Dual Control Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          <button
            onClick={toggleViewType}
            style={{
              backgroundColor: '#334155',
              color: '#ffffff',
              border: '1px solid #475569',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{viewType === 'mobile' ? 'Mobile' : 'Desktop Web'}</span>
          </button>

          <button
            onClick={toggleRole}
            style={{
              backgroundColor: '#334155',
              color: '#ffffff',
              border: '1px solid #475569',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: currentRole === 'player' ? '#4ade80' : '#fbbf24'
            }}></span>
            Role: <strong style={{ textTransform: 'capitalize' }}>{currentRole} View</strong>
          </button>

        </div>
      </header>

      {/* Main View Area */}
      <main style={{ flex: 1, padding: '20px' }}>
        {currentRole === 'player' ? (
          <PlayerDashboard />
        ) : (
          <div style={{
            maxWidth: '500px',
            margin: '60px auto',
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid #334155'
          }}>
            <h2 style={{ color: '#fbbf24', margin: 0, fontSize: '18px', fontWeight: '700' }}>
              Admin Mode unavailable at the moment
            </h2>
          </div>
        )}
      </main>
    </div>
  );
}