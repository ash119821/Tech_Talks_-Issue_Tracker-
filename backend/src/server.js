// backend/src/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const logsRouter = require('./routes/logs');
const incidentsRouter = require('./routes/incidents');

app.use('/api/logs', logsRouter);
app.use('/api/incidents', incidentsRouter);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Example test routes (you will use models later)
app.get('/api/ping-db', async (req, res) => {
  try {
    const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting
    res.json({ mongoState: state });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Mongoose connection with retry
const MONGO_URI = process.env.MONGO_URI || null;
const PORT = process.env.PORT || 4000;

async function connectWithRetry(uri, retries=5, delayMs=3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.warn(`MongoDB connection attempt ${i+1} failed: ${err.message}`);
      if (i < retries - 1) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
}

async function startServer() {
  if (MONGO_URI) {
    try {
      await connectWithRetry(MONGO_URI);
    } catch (err) {
      console.error('Could not connect to MongoDB. Exiting.', err);
      process.exit(1);
    }
  } else {
    console.warn('MONGO_URI not set — running without DB (in-memory)');
  }

  server.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

startServer();
