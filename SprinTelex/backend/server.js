import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './database'; // Assuming there's a database.js for MongoDB connection
import { sendOTPEmail } from './services/emailService'; // Import the email service

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB().then(() => console.log('Connected to MongoDB')).catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Route for sending OTP email
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }
  try {
    await sendOTPEmail(email); // Assuming sendOTPEmail function takes care of generating and sending the OTP
    console.log(`OTP sent to ${email}`);
    res.status(200).send({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send({ message: 'Failed to send OTP' });
  }
});

// Initial test route
app.get('/api/ping', (req, res) => {
  console.log('Ping received');
  res.status(200).send('Pong');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});