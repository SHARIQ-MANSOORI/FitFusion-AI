const mongoose = require('mongoose');

// Connect to MongoDB using connection URI from environment variables
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};

module.exports = connectDB;
