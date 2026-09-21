import React, { useState } from 'react';
import { Tag, MapPin, Calendar, ArrowLeft, Check, UploadCloud, X } from 'lucide-react';
import { createItem } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Electronics', 'Books', 'ID Cards', 'Bags', 'Clothing', 'Keys', 'Others'];

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582142407894-ec85a1260aee?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80'
];

export default function ReportLost({ onSuccess, onCancel }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [image, setImage] = useState(DEMO_IMAGES[0]);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !location || !description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await createItem({
        title,
        category,
        type: 'LOST',
        image,
        location,
        date,
        description
      });

      if (res.success) {
        onSuccess(res.item._id);
      } else {
        setError(res.message || 'Failed to post lost item');
      }
    } catch (err) {
      setError('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '30px' }}>
      <button
        onClick={onCancel}
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

      <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Tag size={20} color="#e11d48" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Report Lost Item
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500 }}>
              Fill details to ask campus community for help
            </p>
          </div>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Item Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Sony WH-1000XM4 Headphones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.88rem' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
              style={{ background: '#ffffff', fontSize: '0.88rem' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Library 2nd Fl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.88rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                Date Lost *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.85rem' }}
                required
              />
            </div>
          </div>

          {/* Custom Modern Photo Upload Zone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              📷 Item Photo
            </label>

            <input
              id="lost-photo-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              {image ? (
                <div style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #4f46e5',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <img src={image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Remove Photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : null}

              <label
                htmlFor="lost-photo-input"
                style={{
                  flex: 1,
                  border: '2px dashed #cbd5e1',
                  borderRadius: '14px',
                  padding: '14px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(79, 70, 229, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4f46e5'
                }}>
                  <UploadCloud size={18} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                  {image ? 'Change Photo' : 'Upload Item Photo'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Tap to browse image files
                </span>
              </label>
            </div>

            {/* Quick Sample Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Or pick a sample photo:</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {DEMO_IMAGES.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setImage(imgUrl)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: image === imgUrl ? '2px solid #e11d48' : '1px solid #cbd5e1',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <img src={imgUrl} alt="demo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {image === imgUrl && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(225, 29, 72, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={14} color="white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Description *
            </label>
            <textarea
              placeholder="Describe color, marks, case details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows={3}
              style={{ fontSize: '0.88rem' }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              padding: '12px',
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)',
              marginTop: '4px'
            }}
          >
            {loading ? 'Posting...' : 'Post Lost Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
