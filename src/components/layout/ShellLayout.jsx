import React from 'react';
import { Navbar } from './Navbar';

export const ShellLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 0' }}>
        {children}
      </main>
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.25rem 0', background: 'rgba(0,0,0,0.2)', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            VoxSim LMS Public Speaking Simulator &bull; Lightweight Architecture
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
            <span>No External WebSockets</span>
            <span>Server-side Key Security</span>
            <span>Mobile Responsive</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
