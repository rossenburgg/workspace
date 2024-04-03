import { Router } from 'express';
import { sendOTPEmail } from '../services/emailService';

const router = Router();

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    console.log(`Received request to send OTP to ${email}`);
    await sendOTPEmail(email);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ message: 'Failed to send OTP email.', error: error.message });
  }
});

export default router;