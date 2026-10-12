const express = require('express');
const {
  registerSchema,
  loginSchema,
  register,
  login,
  getMe,
} = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

// Public auth routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected user route
router.get('/me', auth, getMe);

module.exports = router;
