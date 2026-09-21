import React, { useState } from 'react';
import { Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { sendOTP } from '../services/api';

export default function Login({ onOtpSent }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await sendOTP(phone);
      if (res.success) {
        onOtpSent(phone, res.demoOtp || '123456');
      } else {
        setError(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '10px 0 30px' }}>
      <div className="glass-card" style={{ padding: '28px 20px', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)'
        }}>
          <Smartphone size={26} color="#ffffff" />
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          Campus Student Login
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '20px', fontWeight: 500 }}>
          Enter mobile number to sign in or create account
        </p>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            color: '#e11d48',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '6px'
          }}>
            📱 Mobile Phone Number
          </label>
          
          <input
            type="tel"
            className="input-field"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ marginBottom: '18px', fontSize: '0.95rem', letterSpacing: '0.5px' }}
            required
          />

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
          >
            {loading ? 'Sending OTP...' : (
              <>
                Send OTP Code <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          paddingTop: '14px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          color: '#64748b',
          fontSize: '0.75rem',
          fontWeight: 500
        }}>
          <ShieldCheck size={13} color="#059669" />
          <span>Amrita Student Secure Authentication</span>
        </div>
      </div>
    </div>
  );
}
