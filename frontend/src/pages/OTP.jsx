import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { sendOTP, verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OTP({ phone, demoOtp, onUpdateDemoOtp, onSuccess, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const { login } = useAuth();

  // Auto-focus first input on mount
  useEffect(() => {
    const firstInput = document.getElementById('otp-input-0');
    if (firstInput) firstInput.focus();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '');
    if (cleanVal.length > 1) {
      handlePasteValue(cleanVal);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePasteValue = (pastedText) => {
    const digits = pastedText.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;
    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((d, idx) => {
      newOtp[idx] = d;
    });
    setOtp(newOtp);

    const focusIdx = Math.min(digits.length, 5);
    const targetInput = document.getElementById(`otp-input-${focusIdx}`);
    if (targetInput) targetInput.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handlePasteValue(pastedData);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoFill = () => {
    const code = (demoOtp || '123456').toString().split('');
    const newOtp = ['', '', '', '', '', ''];
    code.forEach((d, idx) => {
      if (idx < 6) newOtp[idx] = d;
    });
    setOtp(newOtp);
    const lastInput = document.getElementById('otp-input-5');
    if (lastInput) lastInput.focus();
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');

    try {
      const res = await sendOTP(phone);
      const newCode = res.demoOtp || Math.floor(100000 + Math.random() * 900000).toString();
      if (onUpdateDemoOtp) {
        onUpdateDemoOtp(newCode);
      }
      setResendMsg(`New 6-digit OTP code sent: ${newCode}`);
      setResendTimer(30);
      setTimeout(() => setResendMsg(''), 5000);
    } catch (err) {
      setError('Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter complete 6-digit verification code');
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
        setError(res.message || 'Verification failed. Please check code.');
      }
    } catch (err) {
      setError('Server error during verification. Try again.');
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
        <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '12px', fontWeight: 500 }}>
          Sent to <strong style={{ color: '#4f46e5' }}>{phone || 'your phone'}</strong>
        </p>

        {/* Demo OTP Alert Box with Auto-fill CTA */}
        <div style={{
          background: 'rgba(79, 70, 229, 0.06)',
          border: '1px dashed #4f46e5',
          color: '#4f46e5',
          padding: '8px 14px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <span>
            ✨ Code: <strong style={{ color: '#0f172a', letterSpacing: '1.5px', fontSize: '0.9rem' }}>{demoOtp || '123456'}</strong>
          </span>
          <button
            type="button"
            onClick={handleAutoFill}
            style={{
              background: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <Zap size={12} /> Auto-fill
          </button>
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
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
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
                  outline: 'none',
                  boxShadow: digit ? '0 0 0 2px rgba(79, 70, 229, 0.15)' : 'none'
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
            onClick={handleResend}
            disabled={resendTimer > 0 || resendLoading}
            style={{
              background: 'none',
              border: 'none',
              color: resendTimer > 0 ? '#94a3b8' : '#4f46e5',
              cursor: resendTimer > 0 || resendLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700,
              fontFamily: 'inherit'
            }}
          >
            <RefreshCw size={12} className={resendLoading ? 'animate-spin' : ''} />
            {resendLoading ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
