import React from 'react';
import { Search, PlusCircle, User as UserIcon, LogOut, FileText, Home as HomeIcon, MapPin, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => setActivePage('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Search size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Campus <span style={{ color: '#818cf8' }}>Lost & Found</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Official University Portal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePage('home')}
            className={`nav-btn ${activePage === 'home' ? 'active' : ''}`}
            style={navStyle(activePage === 'home')}
          >
            <HomeIcon size={18} /> Home
          </button>

          {user && (
            <>
              <button
                onClick={() => setActivePage('report-lost')}
                style={navStyle(activePage === 'report-lost', '#ef4444')}
              >
                <Tag size={18} /> Report Lost
              </button>

              <button
                onClick={() => setActivePage('report-found')}
                style={navStyle(activePage === 'report-found', '#10b981')}
              >
                <PlusCircle size={18} /> Report Found
              </button>

              <button
                onClick={() => setActivePage('my-posts')}
                style={navStyle(activePage === 'my-posts')}
              >
                <FileText size={18} /> My Posts
              </button>
            </>
          )}
        </nav>

        {/* User Profile / Auth Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setActivePage('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: activePage === 'profile' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${activePage === 'profile' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '8px 14px',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setActivePage('home');
                }}
                title="Logout"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('login')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.9rem' }}
            >
              <UserIcon size={16} /> Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function navStyle(isActive, customColor) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
    background: isActive 
      ? (customColor ? `rgba(${customColor === '#ef4444' ? '239, 68, 68' : '16, 185, 129'}, 0.2)` : 'rgba(99, 102, 241, 0.2)')
      : 'transparent',
    color: isActive 
      ? (customColor || '#818cf8') 
      : '#94a3b8'
  };
}
