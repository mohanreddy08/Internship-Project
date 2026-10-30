const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, createEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
