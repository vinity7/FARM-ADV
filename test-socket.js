const io = require('socket.io-client');
const socket = io('http://localhost:5000');

socket.on('connect', () => {
    console.log('Connected to server via Socket.io');
});

socket.on('priceUpdate', (data) => {
    console.log('Received Real-time Price Update:', data);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

console.log('Listening for price updates (emitted every 30s)...');
