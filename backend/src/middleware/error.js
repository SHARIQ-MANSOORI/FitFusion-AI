// Custom operational error class
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Global Express error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle invalid MongoDB ObjectId cast errors
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const status = err instanceof AppError ? err.status : 500;
  // Expose error message only if operational AppError
  const message = err instanceof AppError ? err.message : 'Something went wrong';

  res.status(status).json({ message });
};

module.exports = {
  AppError,
  errorHandler,
};
