// src/components/ConfirmationModal.jsx
import React from 'react';
import { useApp } from '../context/AppContext';

export default function ConfirmationModal() {
  const { alertModal, hideAlert } = useApp();

  if (!alertModal) return null;

  const { title, message, type } = alertModal;

  const colorMap = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  const activeColor = colorMap[type] || '#0f172a';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(13, 21, 39, 0.82)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '16px', zIndex: 999
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '28px 24px',
        width: '100%',
        maxWidth: '360px',
        textAlign: 'center',
        boxSizing: 'border-box',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Unhighlighted Plain Tag */}
        <span style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: '800',
          color: '#64748b',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          MATCH RESULT
        </span>

        {/* Highlighted Title (e.g. Red for Match Defeat, Green for Match Victory) */}
        <h3 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '22px', 
          fontWeight: '900', 
          color: activeColor 
        }}>
          {title}
        </h3>

        <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
          {message}
        </p>

        <button
          onClick={hideAlert}
          style={{
            width: '100%',
            backgroundColor: activeColor,
            color: '#ffffff',
            border: 'none',
            borderRadius: '16px',
            padding: '14px 0',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer',
            letterSpacing: '0.05em'
          }}
        >
          OKAY
        </button>
      </div>
    </div>
  );
}