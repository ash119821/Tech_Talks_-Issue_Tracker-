// socket-listener.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:4000", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("log:new", (log) => {
  console.log("Received log:new:", log);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
