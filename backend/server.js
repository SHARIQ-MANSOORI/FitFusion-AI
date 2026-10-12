require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY', 'GEMINI_MODEL', 'CLIENT_URL'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to database before starting HTTP listener
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
