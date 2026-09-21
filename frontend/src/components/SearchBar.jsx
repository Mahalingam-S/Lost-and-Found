import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ search, setSearch }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Search
        size={18}
        color="#64748b"
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        placeholder="Search lost items (e.g. Headphones, ID Card)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
        style={{
          paddingLeft: '44px',
          paddingRight: search ? '40px' : '16px',
          height: '46px',
          fontSize: '0.9rem',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          color: '#0f172a'
        }}
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
