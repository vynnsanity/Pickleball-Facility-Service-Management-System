// src/components/AppLayout.jsx
import React, { useState, useEffect } from 'react';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
}

export default function AppLayout({ children }) {
  const isDesktop = useIsDesktop();

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#74C365', // Bold Pickleball Court Green
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      boxSizing: 'border-box'
    }}>
      <main style={{
        width: '100%',
        maxWidth: isDesktop ? '1180px' : '480px',
        margin: '0 auto',
        padding: isDesktop ? '32px 24px' : '16px',
        boxSizing: 'border-box',
        transition: 'max-width 0.2s ease, padding 0.2s ease'
      }}>
        {children}
      </main>
    </div>
  );
}