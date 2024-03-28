require('dotenv').config({ path: './config/.env.local' }); // Ensure environment variables are loaded
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reelRoutes = require('./routes/reelRoutes'); // Include Reel routes
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3001;

connectDB(); // Initialize the database connection

app.use(bodyParser.json());

// Error handling for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON');
    return res.status(400).json({ message: 'The request contains malformed JSON.' });
  }
  next();
});

// Use routes
app.use('/api', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/reel', reelRoutes); // Use Reel routes

app.get('/api/ping', (req, res) => {
  console.log('Received request for /api/ping');
  try {
    res.json({ success: true, message: 'Pong!' });
    console.log('Successfully responded to /api/ping');
  } catch (error) {
    console.error('Error responding to /api/ping:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:19006", // Adjust according to your frontend deployment
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('send', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});