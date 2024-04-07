const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;
  
  try {
    const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
      to: token,
      notification: {
        title: title,
        body: body,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${process.env.mongodb_SERVER_KEY}`,
      },
    });

    console.log(`Notification sent successfully to token: ${token}`);
    res.status(200).json({ success: true, message: 'Notification sent successfully', response: response.data });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
});

module.exports = router;
