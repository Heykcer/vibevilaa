import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from '../components/Layout/Navbar';
import FloatingElements from '../components/Common/FloatingElements';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  
  // A simple way to get a user name for the chat since we don't have a full auth context handy in this snippet
  const [userName] = useState(() => localStorage.getItem('userName') || `Contestant_${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    // 1. Fetch channel details to make sure it exists and get its name
    const fetchRoomInfo = async () => {
      try {
        const res = await fetch(`${API_BASE}/channels`);
        const data = await res.json();
        if (data.success) {
          const room = data.data.find(r => r._id === roomId);
          if (room) setRoomDetails(room);
          else navigate('/villa/rooms'); // Redirect if not found
        }
      } catch (err) {
        console.error('Error fetching room info', err);
      }
    };

    // 2. Fetch past messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/channels/${roomId}/messages`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error('Error fetching messages', err);
      }
    };

    fetchRoomInfo();
    fetchMessages();

    // 3. Setup Socket.IO connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_room', roomId);
    });

    newSocket.on('broadcast_live_chat', (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, navigate]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      channelId: roomId,
      senderName: userName,
      text: newMessage,
    };

    try {
      const token = localStorage.getItem('token') || '';
      // 1. Save to DB
      const res = await fetch(`${API_BASE}/channels/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        // 2. Broadcast via socket
        const socketData = {
          roomId,
          senderName: userName,
          text: newMessage,
          time: data.data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        socket.emit('send_live_chat', socketData);
        setNewMessage('');
      } else {
        console.error('Failed to send message', data);
      }
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <>
      <Navbar />
      <FloatingElements />
      <main style={{ padding: 'var(--space-16) var(--space-8)', minHeight: '100vh', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            onClick={() => navigate('/villa/rooms')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'transparent',
              color: 'var(--color-primary-light)',
              border: '1px solid var(--color-primary-light)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            &larr; Back
          </button>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-light)', margin: 0 }}>
            {roomDetails ? roomDetails.name : 'Loading Room...'}
          </h1>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          {/* Chat Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {messages.map((msg, idx) => (
              <div 
                key={msg._id || idx}
                style={{
                  alignSelf: msg.senderName === userName ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  background: msg.senderName === userName ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  borderBottomRightRadius: msg.senderName === userName ? 0 : 'var(--radius-lg)',
                  borderBottomLeftRadius: msg.senderName !== userName ? 0 : 'var(--radius-lg)',
                }}
              >
                <div style={{ fontSize: 'var(--text-xs)', color: msg.senderName === userName ? 'rgba(255,255,255,0.7)' : 'var(--color-primary-light)', marginBottom: 'var(--space-1)' }}>
                  {msg.senderName} {msg.time && `• ${msg.time}`}
                </div>
                <div style={{ color: '#fff', fontSize: 'var(--text-base)' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              padding: 'var(--space-4)',
              background: 'rgba(0,0,0,0.2)',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              gap: 'var(--space-3)'
            }}
          >
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                padding: '0 var(--space-6)',
                borderRadius: 'var(--radius-full)',
                background: newMessage.trim() ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: 'none',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                transition: 'var(--transition-fast)'
              }}
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default ChatRoomPage;
