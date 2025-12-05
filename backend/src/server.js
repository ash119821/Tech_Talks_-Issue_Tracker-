require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allow all origins in dev
const io = new Server(server, { cors: { origin: "*" }});
app.set("io", io);

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post("/api/logs", (req, res) => {
  // simple in-memory store for now
  if (!global._logs) global._logs = [];
  const payload = { _id: Date.now().toString(), timestamp: new Date().toISOString(), ...req.body };
  global._logs.unshift(payload);
  // emit via socket.io
  const io = req.app.get("io");
  if (io) io.emit("log:new", payload);
  res.status(201).json(payload);
});

app.get("/api/logs", (req, res) => {
  res.json(global._logs || []);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));

