import dotenv from 'dotenv';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Determine Port
const PORT = process.env.PORT || 5000;

// Start Server Listening
const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`
  );
});

// Initialize Socket.io Server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Configure Socket event handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to WebSockets: ${socket.id}`);

  // Client joining chat channel or episode streams
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`🚪 Client ${socket.id} joined room: ${roomId}`);
  });

  // Real-time live chat broadcasting
  socket.on('send_live_chat', (data) => {
    // data structure: { roomId, senderName, text, time }
    io.to(data.roomId).emit('broadcast_live_chat', data);
  });

  // Real-time reactions broadcasting
  socket.on('trigger_reaction', (data) => {
    // data structure: { roomId, emoji }
    io.to(data.roomId).emit('broadcast_reaction', data);
  });

  // Real-time voting updates broadcasting
  socket.on('cast_vote', (data) => {
    // data structure: { contestantId, votesCount, popularity }
    io.emit('update_rankings', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected from WebSockets: ${socket.id}`);
  });
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Promise Rejection: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
