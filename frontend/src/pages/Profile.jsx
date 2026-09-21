import React, { useState } from 'react';
import { User, Phone, Mail, Save, LogOut, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';

export default function Profile({ onGoHome }) {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 16px', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
        Please login to view your profile.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await updateProfile({ name, email });
      if (res.success) {
        updateUser(res.user);
        setMsg('Profile updated successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      setMsg('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '30px' }}>
      <div className="glass-card" style={{ padding: '24px 18px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
            {user.name || 'Campus Student'}
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
            <CheckCircle2 size={12} /> Verified Student Account
          </div>
        </div>

        {msg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#059669',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              style={{ fontSize: '0.88rem' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Mobile Phone (Registered)
            </label>
            <input
              type="text"
              className="input-field"
              style={{ opacity: 0.7, cursor: 'not-allowed', fontSize: '0.88rem', background: '#f1f5f9' }}
              value={user.phone}
              disabled
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              University Email
            </label>
            <input
              type="email"
              placeholder="student@amrita.edu"
              className="input-field"
              style={{ fontSize: '0.88rem' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: '10px', fontSize: '0.9rem', marginTop: '4px' }}
          >
            <Save size={15} /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Account: {user.phone}</span>

          <button
            onClick={() => {
              logout();
              onGoHome();
            }}
            style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              color: '#e11d48',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
