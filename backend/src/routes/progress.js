const express = require('express');
const {
  progressSchema,
  add,
  mine,
  update,
  remove,
} = require('../controllers/progressController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all progress routes
router.use(auth);

router.post('/add', validate(progressSchema), add);
router.get('/my', mine);
router.put('/:id', validate(progressSchema), update);
router.delete('/:id', remove);

module.exports = router;
