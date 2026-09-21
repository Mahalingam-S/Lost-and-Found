import React, { useState } from 'react';
import { KeyRound, ArrowRight, RefreshCw } from 'lucide-react';
import { verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OTP({ phone, demoOtp, onSuccess, onBack }) {
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const { login } = useAuth();

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyOTP(phone, fullOtp);
      if (res.success) {
        login(res.user, res.token);
        onSuccess();
      } else {
        setError(res.message || 'Verification failed');
      }
    } catch (err) {
      setError('Server error during OTP verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ padding: '10px 0 30px' }}>
      <div className="glass-card" style={{ padding: '28px 18px', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
        }}>
          <KeyRound size={26} color="#ffffff" />
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          Verification Code
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 500 }}>
          Sent to <strong style={{ color: '#4f46e5' }}>{phone}</strong>
        </p>

        {/* Demo OTP Alert Box */}
        <div style={{
          background: 'rgba(79, 70, 229, 0.08)',
          border: '1px dashed #4f46e5',
          color: '#4f46e5',
          padding: '6px 12px',
          borderRadius: '10px',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '18px',
          display: 'inline-block'
        }}>
          ✨ Demo OTP Code: <strong style={{ color: '#0f172a', letterSpacing: '1px' }}>{demoOtp || '123456'}</strong>
        </div>

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

        {resendMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#059669',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            {resendMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '20px'
          }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '38px',
                  height: '46px',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  background: '#f8fafc',
                  border: digit ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  outline: 'none'
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginBottom: '12px' }}
          >
            {loading ? 'Verifying...' : (
              <>
                Verify & Login <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 500,
              fontFamily: 'inherit'
            }}
          >
            ← Change Number
          </button>

          <button
            type="button"
            onClick={() => {
              setResendMsg('New OTP code sent: 123456');
              setTimeout(() => setResendMsg(''), 4000);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              cursor: 'pointer',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700,
              fontFamily: 'inherit'
            }}
          >
            <RefreshCw size={12} /> Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
