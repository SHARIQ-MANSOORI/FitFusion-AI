const express = require('express');
const { dietSchema, generateDiet } = require('../controllers/aiController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/generate', auth, validate(dietSchema), generateDiet);

module.exports = router;
