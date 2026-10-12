const { AppError } = require('./error');

// Express middleware factory that validates request body against a Zod schema
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Extract the first validation issue message
    const firstIssueMessage = result.error.issues[0]?.message || 'Validation failed';
    return next(new AppError(firstIssueMessage, 400));
  }

  // Replace req.body with parsed/sanitized schema output
  req.body = result.data;
  next();
};

module.exports = validate;
