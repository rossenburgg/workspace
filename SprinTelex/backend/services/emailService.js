import nodemailer from 'nodemailer';

const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`Attempting to send OTP to ${email}`);
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Example for Gmail. Change according to your email provider
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,
      subject: 'Your OTP for SprinTelex',
      text: `Your OTP is: ${otp}`, // The OTP should be dynamically generated in a real application
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.response}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
};

export { sendOTPEmail };