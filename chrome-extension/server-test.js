const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send a test event every 5 seconds
  const intervalId = setInterval(() => {
    const testData = {
      timestamp: Date.now(),
      message: 'Test qorexalEvent from server'
    };
    
    console.log('Emitting qorexalEvent:', testData);
    socket.emit('qorexalEvent', testData);
  }, 5000);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(intervalId);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 