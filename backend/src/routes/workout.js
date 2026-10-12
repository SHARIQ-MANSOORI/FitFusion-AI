const express = require('express');
const { workoutSchema, generateWorkout } = require('../controllers/aiController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/generate', auth, validate(workoutSchema), generateWorkout);

module.exports = router;
