const express = require('express');
const { chatSchema, askCoach } = require('../controllers/aiController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/ask', auth, validate(chatSchema), askCoach);

module.exports = router;
