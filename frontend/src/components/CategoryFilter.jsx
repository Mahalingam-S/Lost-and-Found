import React from 'react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Books',
  'ID Cards',
  'Bags',
  'Clothing',
  'Keys',
  'Others'
];

export default function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
      scrollbarWidth: 'none'
    }}>
      {CATEGORIES.map((cat) => {
        const isSelected = (selectedCategory === '' && cat === 'All') || selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: isSelected ? 'none' : '1px solid #e2e8f0',
              background: isSelected ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : '#ffffff',
              color: isSelected ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.82rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.25)' : '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
