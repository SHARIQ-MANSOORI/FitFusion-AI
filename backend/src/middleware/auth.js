const jwt = require('jsonwebtoken');
const { AppError } = require('./error');

// Protect routes by verifying JWT in the Authorization header
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Validate presence and Bearer format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Not authorized', 401));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || !parts[1]) {
    return next(new AppError('Not authorized', 401));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    // Handle any JWT verification failures (expired, tampered, invalid format)
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = auth;
