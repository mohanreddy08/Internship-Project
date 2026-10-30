const Registration = require('../models/Registration');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Register user for an event
// @route   POST /api/registrations/:eventId
// @access  Protected
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Check if user is already registered for this event
    const existingRegistration = await Registration.findOne({ eventId, userId });
    if (existingRegistration) {
      return res.status(400).json({
        message: 'You have already registered for this event',
        registration: existingRegistration,
      });
    }

    // Generate unique pass ID
    const passId = `CSYNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create registration with status determined by capacityMiddleware
    const registration = await Registration.create({
      eventId,
      userId,
      passId,
      status: req.registrationStatus, // 'confirmed' or 'waitlisted'
    });

    // If confirmed, atomically increment event.registeredCount
    if (req.registrationStatus === 'confirmed') {
      await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });
    }

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('eventId')
      .populate('userId', 'name rollNumber email department');

    res.status(201).json({
      message:
        req.registrationStatus === 'confirmed'
          ? 'Registration confirmed!'
          : 'Event is full! You have been added to the waitlist.',
      registration: populatedRegistration,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }
    res.status(500).json({ message: 'Server error registering for event', error: error.message });
  }
};

// @desc    Get current user's passes / registrations
// @route   GET /api/registrations/my-passes
// @access  Protected
const getMyPasses = async (req, res) => {
  try {
    const passes = await Registration.find({ userId: req.user._id })
      .populate('eventId')
      .sort({ registeredAt: -1 });

    res.json(passes);
  } catch (error) {
    console.error('Get my passes error:', error.message);
    res.status(500).json({ message: 'Server error fetching your passes', error: error.message });
  }
};

// @desc    Get all registrations for a specific event
// @route   GET /api/registrations/event/:eventId
// @access  Protected (Admin only)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.find({ eventId })
      .populate('userId', 'name rollNumber email department')
      .sort({ registeredAt: 1 });

    res.json({
      event,
      registrations,
    });
  } catch (error) {
    console.error('Get event registrations error:', error.message);
    res.status(500).json({
      message: 'Server error fetching event registrations',
      error: error.message,
    });
  }
};

module.exports = {
  registerForEvent,
  getMyPasses,
  getEventRegistrations,
};
