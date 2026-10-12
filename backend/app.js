const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./src/middleware/error');
const authRoutes = require('./src/routes/auth');
const progressRoutes = require('./src/routes/progress');
const workoutRoutes = require('./src/routes/workout');
const dietRoutes = require('./src/routes/diet');
const chatRoutes = require('./src/routes/chat');

const app = express();

// Set security-related HTTP response headers
app.use(helmet());

// Configure CORS for trusted client origin
app.use(cors({ origin: process.env.CLIENT_URL }));

// Parse incoming JSON requests with body size limit
app.use(express.json({ limit: '10kb' }));

// General rate limiter for /api: 200 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
});
app.use('/api', apiLimiter);

// Stricter rate limiter specifically for auth endpoints: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
  skip: () => process.env.NODE_ENV === 'test',
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Stricter rate limiter for AI endpoints: 30 requests per hour
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
  skip: () => process.env.NODE_ENV === 'test',
});
app.use('/api/workout', aiLimiter);
app.use('/api/diet', aiLimiter);
app.use('/api/chat', aiLimiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
