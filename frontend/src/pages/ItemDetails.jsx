import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Tag, User, Phone, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { getItemById } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ItemDetails({ itemId, onBack }) {
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getItemById(itemId);
        if (res.success) {
          setItem(res.item);
        }
      } catch (err) {
        console.error('Error fetching item details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [itemId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
        Loading item details...
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
        Item not found.
        <br /><br />
        <button onClick={onBack} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          ← Go Back
        </button>
      </div>
    );
  }

  const isLost = item.type === 'LOST';
  const isResolved = item.status === 'RESOLVED';

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '30px' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          color: '#0f172a',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          marginBottom: '14px',
          fontSize: '0.82rem',
          fontWeight: 700,
          fontFamily: 'inherit',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}
      >
        <ArrowLeft size={14} /> Back to Feed
      </button>

      {/* Main Detail Card */}
      <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        {/* Mobile Hero Image View */}
        <div style={{
          width: '100%',
          height: '240px',
          backgroundColor: '#e2e8f0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img
            src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px'
          }}>
            {isResolved ? (
              <span className="badge-resolved">RESOLVED</span>
            ) : isLost ? (
              <span className="badge-lost">LOST ITEM</span>
            ) : (
              <span className="badge-found">FOUND ITEM</span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              background: 'rgba(79, 70, 229, 0.08)',
              color: '#4f46e5',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '8px'
            }}>
              <Tag size={11} /> {item.category}
            </span>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
              {item.title}
            </h2>
          </div>

          {/* Quick Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            background: '#f8fafc',
            padding: '12px',
            borderRadius: '14px',
            marginBottom: '18px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#f43f5e" flexShrink={0} />
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Location</span>
                <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{item.location}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#0284c7" flexShrink={0} />
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Date</span>
                <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{item.date}</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Description
            </h4>
            <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, whiteSpace: 'pre-line', fontWeight: 400 }}>
              {item.description}
            </p>
          </div>

          {/* Poster info */}
          <div style={{
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Posted by</span>
                <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{item.userName || 'Campus User'}</strong>
              </div>
            </div>

            <a
              href={`tel:${item.userPhone || '+919876543210'}`}
              style={{
                background: 'rgba(2, 132, 199, 0.08)',
                color: '#0284c7',
                border: '1px solid rgba(2, 132, 199, 0.2)',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Phone size={13} /> Call Poster
            </a>
          </div>

          {/* Claim Action Button */}
          {!isResolved && (
            <button
              onClick={() => setShowClaimModal(true)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                background: isLost ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}
            >
              {isLost ? '🙋 I Found This Item' : '✋ This is Mine'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Claim Modal */}
      {showClaimModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0'
        }}>
          <div className="glass-card animate-slide-up" style={{
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {isLost ? 'Found this item?' : 'Claiming this item'}
            </h3>

            {claimSubmitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={40} color="#10b981" style={{ marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Claim Request Sent!</h4>
                <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '16px' }}>
                  The poster ({item.userName}) has been notified.
                </p>
                <button
                  onClick={() => {
                    setShowClaimModal(false);
                    setClaimSubmitted(false);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '14px' }}>
                  Send a message to <strong>{item.userName}</strong> to verify details or arrange handover.
                </p>

                <textarea
                  placeholder="Describe distinguishing marks or handover location..."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  className="input-field"
                  rows={3}
                  style={{ marginBottom: '16px', fontSize: '0.85rem' }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setClaimSubmitted(true)}
                    className="btn-primary"
                    style={{ flex: 2, padding: '10px', fontSize: '0.85rem' }}
                  >
                    <Send size={14} /> Send Claim
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
