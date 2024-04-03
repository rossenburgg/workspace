const express = require('express');
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

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});