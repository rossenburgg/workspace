const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000; // Use a port other than 5000
const connectDB = require('./utils/dbConnect');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB
connectDB();

app.use(express.json());

app.get('/ping', (req, res) => {
  console.log('Received ping, server is running');
  res.status(200).send('Server is running!');
});

// Apply Helmet for setting various HTTP headers for security
app.use(helmet());

// Define rate limits for login and registration routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to the auth routes
app.use('/api/auth', authLimiter, authRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});