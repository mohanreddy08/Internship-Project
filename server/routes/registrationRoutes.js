const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyPasses,
  getEventRegistrations,
} = require('../controllers/registrationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { checkCapacity } = require('../middleware/capacityMiddleware');

router.post('/:eventId', protect, checkCapacity, registerForEvent);
router.get('/my-passes', protect, getMyPasses);
router.get('/event/:eventId', protect, adminOnly, getEventRegistrations);

module.exports = router;
