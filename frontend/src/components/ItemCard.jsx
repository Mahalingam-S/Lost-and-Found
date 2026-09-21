import React from 'react';
import { MapPin, Calendar, Tag, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ItemCard({ item, onClick }) {
  const isLost = item.type === 'LOST';
  const isResolved = item.status === 'RESOLVED';

  return (
    <div 
      onClick={onClick}
      className="glass-card"
      style={{
        padding: '12px',
        cursor: 'pointer',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        position: 'relative',
        opacity: isResolved ? 0.75 : 1
      }}
    >
      {/* Thumbnail Image */}
      <div style={{
        position: 'relative',
        width: '84px',
        height: '84px',
        borderRadius: '14px',
        backgroundColor: '#e2e8f0',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <img
          src={item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Badge Overlay */}
        <div style={{
          position: 'absolute',
          top: '5px',
          left: '5px'
        }}>
          {isResolved ? (
            <span className="badge-resolved" style={{ fontSize: '0.6rem', padding: '2px 5px' }}>RESOLVED</span>
          ) : isLost ? (
            <span className="badge-lost" style={{ fontSize: '0.6rem', padding: '2px 5px' }}>LOST</span>
          ) : (
            <span className="badge-found" style={{ fontSize: '0.6rem', padding: '2px 5px' }}>FOUND</span>
          )}
        </div>
      </div>

      {/* Info Details */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#4f46e5',
            background: 'rgba(79, 70, 229, 0.08)',
            padding: '1px 7px',
            borderRadius: '10px'
          }}>
            {item.category}
          </span>
        </div>

        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '5px',
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="#f43f5e" flexShrink={0} />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {item.location}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} color="#0284c7" flexShrink={0} />
            <span>{item.date}</span>
          </div>
        </div>
      </div>

      {/* Chevron indicator */}
      <div style={{ paddingLeft: '2px', color: '#94a3b8' }}>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
