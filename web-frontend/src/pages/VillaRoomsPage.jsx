import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import FloatingElements from '../components/Common/FloatingElements';

const VillaRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:5000/api';

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/channels`);
      const data = await res.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName) return;

    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${API_BASE}/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newRoomName, description: newRoomDesc }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewRoomName('');
        setNewRoomDesc('');
        fetchRooms();
      } else {
        alert('Failed to create room: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to create room', err);
    }
  };

  return (
    <>
      <Navbar />
      <FloatingElements />
      <main className="rooms-container" style={{ padding: 'var(--space-16) var(--space-8)', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-light)', fontSize: 'var(--text-4xl)' }}>Villa Chat Rooms</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            + Create Room
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading rooms...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {rooms.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No rooms yet. Be the first to create one!</p>
            ) : (
              rooms.map((room) => (
                <div 
                  key={room._id} 
                  className="room-card"
                  onClick={() => navigate(`/villa/rooms/${room._id}`)}
                  style={{
                    padding: 'var(--space-6)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-text-heading)' }}>{room.name}</h3>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{room.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {showCreateModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 5, 20, 0.8)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(20, 40, 70, 0.9) 0%, rgba(10, 20, 40, 0.95) 100%)',
              padding: 'var(--space-10)',
              borderRadius: 'var(--radius-xl)',
              width: '100%', maxWidth: '450px',
              border: '1px solid rgba(124, 255, 226, 0.2)', // Cyan-ish oceanic border
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(124, 255, 226, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: 'linear-gradient(90deg, var(--color-primary-light), var(--color-secondary))'
              }}></div>
              
              <h2 style={{ 
                marginTop: 0, 
                marginBottom: 'var(--space-6)',
                fontFamily: 'var(--font-heading)',
                color: '#fff', 
                fontSize: 'var(--text-3xl)',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>Create a Villa Room</h2>
              
              <form onSubmit={handleCreateRoom}>
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <label style={{ 
                    display: 'block', marginBottom: 'var(--space-2)', 
                    color: 'var(--color-primary-light)', fontSize: 'var(--text-sm)',
                    fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'
                  }}>Room Name</label>
                  <input 
                    type="text" 
                    value={newRoomName} 
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                    placeholder="E.g. The VIP Lounge"
                    style={{
                      width: '100%', padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.3)', color: '#fff',
                      fontSize: 'var(--text-base)',
                      outline: 'none', transition: 'var(--transition-fast)'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid var(--color-primary-light)';
                      e.target.style.boxShadow = '0 0 10px rgba(124, 255, 226, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--space-8)' }}>
                  <label style={{ 
                    display: 'block', marginBottom: 'var(--space-2)', 
                    color: 'var(--color-primary-light)', fontSize: 'var(--text-sm)',
                    fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'
                  }}>Description (Optional)</label>
                  <input 
                    type="text" 
                    value={newRoomDesc} 
                    onChange={(e) => setNewRoomDesc(e.target.value)}
                    placeholder="What happens in this room..."
                    style={{
                      width: '100%', padding: 'var(--space-4)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.3)', color: '#fff',
                      fontSize: 'var(--text-base)',
                      outline: 'none', transition: 'var(--transition-fast)'
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid var(--color-primary-light)';
                      e.target.style.boxShadow = '0 0 10px rgba(124, 255, 226, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: 'var(--space-3) var(--space-6)', 
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--color-text-muted)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 'var(--radius-md)', 
                      cursor: 'pointer',
                      fontSize: 'var(--text-base)',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      padding: 'var(--space-3) var(--space-8)', 
                      background: 'linear-gradient(45deg, var(--color-primary), var(--color-primary-light))',
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 'var(--radius-md)', 
                      cursor: 'pointer',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'bold',
                      boxShadow: 'var(--shadow-glow)',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Create Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default VillaRoomsPage;
