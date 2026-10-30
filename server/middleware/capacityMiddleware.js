const mongoose = require('mongoose');
const Event = require('../models/Event');

const checkCapacity = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.registeredCount < event.maxCapacity) {
      req.registrationStatus = 'confirmed';
    } else {
      req.registrationStatus = 'waitlisted';
    }

    req.event = event;
    next();
  } catch (error) {
    console.error('Capacity check error:', error.message);
    res.status(500).json({ message: 'Server error checking event capacity' });
  }
};

module.exports = { checkCapacity };
