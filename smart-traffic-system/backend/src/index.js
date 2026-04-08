const express = require('express');
const http = require('http');           // needed to attach Socket.io
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const trafficRoutes = require('./routes/trafficRoutes');
const { calculateSignalTimings } = require('./services/decisionEngine');
const TrafficSnapshot = require('./models/TrafficSnapshot');

const app = express();
const server = http.createServer(app);   // wrap express in http server

// ─── Socket.io Setup ─────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',     // Vite's default port
    methods: ['GET', 'POST']
  }
});

// Make io accessible in controllers
app.set('io', io);

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/traffic', trafficRoutes);

// ─── Health Check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚦 Smart Traffic Backend is running' });
});

// ─── WebSocket Events ────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send the last 5 snapshots immediately on connect
  TrafficSnapshot.find()
    .sort({ timestamp: -1 })
    .limit(5)
    .then(snapshots => {
      socket.emit('initial_data', snapshots);
    });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ─── Database + Server Start ──────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

module.exports = { io };