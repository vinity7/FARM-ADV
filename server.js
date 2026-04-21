require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: process.env.CLIENT_URL || "*" }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for easier initial deployment, can be configured later
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/query', require('./routes/query'));
app.use('/api/prices', require('./routes/market'));
app.use('/api/ledger', require('./routes/ledger'));
app.use('/api/scan', require('./routes/scan'));
app.use('/api/weather', require('./routes/weather'));

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
}

// Catch-all to serve index.html for any non-API routes in production
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.path.startsWith('/api')) {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Socket.io Real-time Updates
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Mock Price Updates every 30 seconds
setInterval(() => {
    const mockUpdates = [
        { crop: "rice", price: `₹${(40 + Math.random() * 10).toFixed(1)}/kg` },
        { crop: "banana", price: `₹${(25 + Math.random() * 10).toFixed(1)}/kg` }
    ];
    io.emit('priceUpdate', mockUpdates);
}, 30000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
