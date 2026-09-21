import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Calendar, Edit3, Trash2, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { getMyPosts, updateItem, deleteItem } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyPosts({ onSelectCard, onReportClick }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await getMyPosts();
      if (res.success) {
        setPosts(res.items);
      }
    } catch (err) {
      console.error('Error fetching my posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleToggleResolved = async (post) => {
    const newStatus = post.status === 'RESOLVED' ? 'ACTIVE' : 'RESOLVED';
    try {
      const res = await updateItem(post._id, { status: newStatus });
      if (res.success) {
        fetchMyPosts();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this listing?')) {
      try {
        const res = await deleteItem(id);
        if (res.success) {
          fetchMyPosts();
        }
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const res = await updateItem(editingPost._id, {
        title: editingPost.title,
        location: editingPost.location,
        description: editingPost.description
      });
      if (res.success) {
        setEditingPost(null);
        fetchMyPosts();
      }
    } catch (err) {
      alert('Failed to save changes');
    }
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <FileText size={22} color="#4f46e5" /> My Reported Items
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500 }}>
            Manage your posts & mark resolved
          </p>
        </div>

        <button
          onClick={() => onReportClick('LOST')}
          className="btn-primary"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
          Loading your posts...
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <AlertCircle size={40} color="#94a3b8" style={{ marginBottom: '10px' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '6px' }}>No active posts</h3>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '16px' }}>
            You haven't posted any lost or found items yet.
          </p>
          <button onClick={() => onReportClick('LOST')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Report an Item Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map(post => {
            const isLost = post.type === 'LOST';
            const isResolved = post.status === 'RESOLVED';

            return (
              <div
                key={post._id}
                className="glass-card"
                style={{
                  padding: '14px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  opacity: isResolved ? 0.75 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'}
                    alt={post.title}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    onClick={() => onSelectCard(post._id)}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      {isResolved ? (
                        <span className="badge-resolved" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>RESOLVED</span>
                      ) : isLost ? (
                        <span className="badge-lost" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>LOST</span>
                      ) : (
                        <span className="badge-found" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>FOUND</span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{post.category}</span>
                    </div>

                    <h4
                      onClick={() => onSelectCard(post._id)}
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '2px'
                      }}
                    >
                      {post.title}
                    </h4>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                      <span><MapPin size={10} color="#f43f5e" inline /> {post.location}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile action bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <button
                    onClick={() => handleToggleResolved(post)}
                    style={{
                      background: isResolved ? 'rgba(16, 185, 129, 0.12)' : '#f8fafc',
                      border: `1px solid ${isResolved ? 'rgba(16, 185, 129, 0.3)' : '#cbd5e1'}`,
                      color: isResolved ? '#059669' : '#0f172a',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={12} />
                    {isResolved ? 'Mark Active' : 'Mark Resolved'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingPost(post)}
                      style={{
                        background: 'rgba(79, 70, 229, 0.08)',
                        border: '1px solid rgba(79, 70, 229, 0.2)',
                        color: '#4f46e5',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Edit3 size={12} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(post._id)}
                      style={{
                        background: 'rgba(244, 63, 94, 0.08)',
                        border: '1px solid rgba(244, 63, 94, 0.2)',
                        color: '#e11d48',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="glass-card animate-slide-up" style={{ maxWidth: '420px', width: '100%', padding: '20px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
              Edit Listing
            </h3>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#0f172a', fontWeight: 700, marginBottom: '3px' }}>Title</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#0f172a', fontWeight: 700, marginBottom: '3px' }}>Location</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                  value={editingPost.location}
                  onChange={(e) => setEditingPost({ ...editingPost, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#0f172a', fontWeight: 700, marginBottom: '3px' }}>Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  style={{ fontSize: '0.85rem' }}
                  value={editingPost.description}
                  onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
