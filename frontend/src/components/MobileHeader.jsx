import React from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileHeader({ activePage, setActivePage }) {
  const { user } = useAuth();

  return (
    <header className="mobile-header">
      <div className="mobile-header-content">
        {/* Left Branding */}
        <div 
          onClick={() => setActivePage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div className="app-logo-badge">
            <Search size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
                Campus<span style={{ color: '#4f46e5' }}>App</span>
              </h1>
              <span className="mini-status-chip">
                <Sparkles size={10} color="#4f46e5" /> LIVE
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#475569', fontWeight: 500 }}>
              <MapPin size={11} color="#e11d48" /> Amrita Vishwa Vidyapeetham, Coimbatore
            </div>
          </div>
        </div>

        {/* Right User Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <button
              onClick={() => setActivePage('profile')}
              style={{
                background: 'rgba(79, 70, 229, 0.08)',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                borderRadius: '20px',
                padding: '4px 10px 4px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: '#0f172a',
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'inherit'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
            </button>
          ) : (
            <button
              onClick={() => setActivePage('login')}
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                border: 'none',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
