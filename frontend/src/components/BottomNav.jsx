import React from 'react';
import { Home, AlertCircle, PlusCircle, FileText, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav({ activePage, setActivePage }) {
  const { user } = useAuth();

  const handleTabClick = (page) => {
    if ((page === 'report-lost' || page === 'report-found' || page === 'my-posts' || page === 'profile') && !user) {
      setActivePage('login');
    } else {
      setActivePage(page);
    }
  };

  const navItems = [
    { id: 'home', label: 'Feed', icon: Home },
    { id: 'report-lost', label: 'Lost', icon: AlertCircle, badgeColor: '#e11d48' },
    { id: 'report-found', label: 'Found', icon: PlusCircle, badgeColor: '#059669' },
    { id: 'my-posts', label: 'Posts', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="bottom-nav-bar">
      <div className="bottom-nav-content">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="icon-wrapper">
                <Icon size={22} color={isActive ? (item.badgeColor || '#4f46e5') : '#64748b'} />
                {isActive && <div className="active-dot" style={{ background: item.badgeColor || '#4f46e5' }} />}
              </div>
              <span style={{ color: isActive ? '#0f172a' : '#64748b', fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
