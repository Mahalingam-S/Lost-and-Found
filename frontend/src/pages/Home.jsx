import React, { useState, useEffect } from 'react';
import { Plus, Search, Tag, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ItemCard from '../components/ItemCard';
import { getItems } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Home({ onSelectCard, onReportClick }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); // '' (All), 'LOST', 'FOUND'
  const [category, setCategory] = useState('');

  const fetchItemsData = async () => {
    setLoading(true);
    try {
      const res = await getItems({ search, type: typeFilter, category });
      if (res.success) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItemsData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, typeFilter, category]);

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '20px' }}>
      {/* Mobile App Hero Header Card - Cool & Warm Light Style */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.07) 0%, rgba(251, 146, 60, 0.08) 100%)',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        borderRadius: '20px',
        padding: '18px 16px',
        marginBottom: '16px',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 800, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Campus Lost & Found Portal
            </span>
            <span style={{ fontSize: '0.72rem', background: '#ffffff', padding: '2px 8px', borderRadius: '12px', color: '#059669', fontWeight: 700, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              ⚡ Realtime
            </span>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', lineHeight: 1.25 }}>
            {user ? `Hello, ${user.name.split(' ')[0]} 👋` : 'Find Campus Belongings 👋'}
          </h2>
          <p style={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.4, marginBottom: '14px', fontWeight: 500 }}>
            Locate or report lost & found items across campus blocks, library & labs.
          </p>

          {/* Dual Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => onReportClick('LOST')}
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)'
              }}
            >
              <Tag size={14} /> Report Lost
            </button>

            <button
              onClick={() => onReportClick('FOUND')}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Plus size={14} /> Report Found
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div style={{ marginBottom: '14px' }}>
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* Type Segment Control Tabs: All | Lost | Found */}
      <div style={{
        display: 'flex',
        background: '#ffffff',
        padding: '3px',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        marginBottom: '14px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
      }}>
        {[
          { label: 'All Items', value: '' },
          { label: '🔴 Lost', value: 'LOST' },
          { label: '🟢 Found', value: 'FOUND' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '11px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: typeFilter === tab.value ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent',
              color: typeFilter === tab.value ? '#ffffff' : '#64748b',
              boxShadow: typeFilter === tab.value ? '0 2px 10px rgba(79, 70, 229, 0.25)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Horizontal Scroll Category Chips */}
      <div style={{ marginBottom: '16px' }}>
        <CategoryFilter selectedCategory={category} setSelectedCategory={setCategory} />
      </div>

      {/* Feed Section Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        padding: '0 2px'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Recent Activity {items.length > 0 && <span style={{ color: '#4f46e5', fontSize: '0.85rem' }}>({items.length})</span>}
        </h3>

        <button
          onClick={fetchItemsData}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            fontWeight: 600,
            fontFamily: 'inherit'
          }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Items List Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>
          Loading campus items...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 16px', margin: '10px 0' }}>
          <AlertCircle size={40} color="#94a3b8" style={{ marginBottom: '10px' }} />
          <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '6px' }}>No items found</h4>
          <p style={{ color: '#64748b', fontSize: '0.82rem', maxWidth: '300px', margin: '0 auto 16px' }}>
            No listings matching your current search or category filter.
          </p>
          <button onClick={() => onReportClick('LOST')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Post New Item
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(item => (
            <ItemCard key={item._id} item={item} onClick={() => onSelectCard(item._id)} />
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => onReportClick('LOST')}
        className="fab-button"
        title="Post Item"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
