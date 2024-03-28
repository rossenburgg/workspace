const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env.local' }); // Ensure the .env.local file is correctly placed in the backend/config directory

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Removed useCreateIndex as it's no longer necessary with newer versions of Mongoose
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`, error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;