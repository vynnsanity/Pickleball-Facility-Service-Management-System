// src/App.jsx
import React from 'react';
import { useApp } from './context/AppContext';
import PlayerDashboard from './components/PlayerDashboard';

export default function App() {
  const { currentRole, toggleRole, viewType, toggleViewType } = useApp();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a', // Forest Court Dark Slate Canvas
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Bar */}
      <header style={{
        padding: '14px 28px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#f9f9f9', letterSpacing: '0.05em' }}>
            Pickleball Service Managment System - Perez, Vicuña, Avila
          </h1>
          <span style={{ fontSize: '16px', color: '#94a3b8' }}>Simulation</span>
        </div>

        {/* Dual Control Switchers */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          <button
            onClick={toggleViewType}
            style={{
              backgroundColor: '#334155',
              color: '#f8fafc',
              border: '1px solid #475569',
              padding: '7px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <span>{viewType === 'mobile' ? 'Mobile' : 'Desktop Web'}</span>
          </button>

          <button
            onClick={toggleRole}
            style={{
              backgroundColor: '#334155',
              color: '#f8fafc',
              border: '1px solid #475569',
              padding: '7px 16px',
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
              backgroundColor: currentRole === 'player' ? '#10b981' : '#f59e0b'
            }}></span>
            Role: <strong style={{ textTransform: 'capitalize' }}>{currentRole} View</strong>
          </button>

        </div>
      </header>

      {/* Main Container */}
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
            border: '1px solid #334155',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ color: '#f59e0b', margin: 0, fontSize: '18px', fontWeight: '700' }}>
              Admin Mode unavailable at the moment
            </h2>
          </div>
        )}
      </main>
    </div>
  );
}