// backend/attack-generator.js

const axios = require('axios');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:4000/api/logs';
const INTERVAL_MS = 1500; // send attack log every 1.5 seconds
const BATCH = 1;          // number of logs per interval

const ips = ['192.168.1.10','192.168.1.50','10.0.0.5','203.0.113.5','45.80.23.11'];
const services = ['auth-service', 'web-server', 'api-gateway', 'db-service'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const attackPatterns = [
  () => ({
    level: 'warning',
    message: `Brute force attempt: multiple failed logins from ${pick(ips)}`,
    service: 'auth-service',
    metadata: { attempts: Math.floor(Math.random()*8)+3, ip: pick(ips) }
  }),

  () => ({
    level: 'error',
    message: `SQL Injection attempt detected on /login`,
    service: 'web-server',
    metadata: { payload: `" OR 1=1 --`, ip: pick(ips) }
  }),

  () => ({
    level: 'warning',
    message: `Port scan detected from ${pick(ips)}`,
    service: 'api-gateway',
    metadata: { ip: pick(ips), ports: [22, 80, 443, 3306] }
  }),

  () => ({
    level: 'error',
    message: `DDoS-like traffic spike from ${pick(ips)}`,
    service: 'web-server',
    metadata: { rps: Math.floor(Math.random()*500)+200, ip: pick(ips) }
  }),

  () => ({
    level: 'warning',
    message: `Suspicious user-agent detected: sqlmap`,
    service: 'web-server',
    metadata: { ua: 'sqlmap/1.5', ip: pick(ips) }
  }),

  () => ({
    level: 'error',
    message: `Unauthorized database access attempt`,
    service: 'db-service',
    metadata: { ip: pick(ips), query: 'DROP TABLE users' }
  })
];

function generateAttackLog() {
  return pick(attackPatterns)();
}

async function sendLog(log) {
  try {
    const res = await axios.post(TARGET_URL, log, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("Attack Log Sent:", log.message);
  } catch (err) {
    console.log("Failed:", err.message);
  }
}

setInterval(() => {
  for (let i = 0; i < BATCH; i++) {
    const log = generateAttackLog();
    sendLog(log);
  }
}, INTERVAL_MS);

console.log("Attack log generator started...");
console.log("Sending logs to:", TARGET_URL);