const Event = require('../models/Event');
const Registration = require('../models/Registration');
const mongoose = require('mongoose');

// @desc    Get all events with optional filters (department, category, search)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { department, category, search } = req.query;

    const query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { clubName: searchRegex },
        { venue: searchRegex },
      ];
    }

    // Sort by upcoming date ascending
    const events = await Event.find(query).sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error.message);
    res.status(500).json({ message: 'Server error fetching events', error: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event by ID error:', error.message);
    res.status(500).json({ message: 'Server error fetching event details' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Protected (Admin only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      clubName,
      department,
      category,
      date,
      venue,
      maxCapacity,
    } = req.body;

    if (
      !title ||
      !description ||
      !clubName ||
      !department ||
      !category ||
      !date ||
      !venue ||
      !maxCapacity
    ) {
      return res.status(400).json({ message: 'Please provide all required event fields' });
    }

    const event = await Event.create({
      title,
      description,
      clubName,
      department,
      category,
      date,
      venue,
      maxCapacity: Number(maxCapacity),
      registeredCount: 0,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error.message);
    res.status(500).json({ message: 'Server error creating event', error: error.message });
  }
};

// @desc    Delete an event and its associated registrations
// @route   DELETE /api/events/:id
// @access  Protected (Admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete associated registrations
    await Registration.deleteMany({ eventId: id });

    // Delete event
    await Event.findByIdAndDelete(id);

    res.json({ message: 'Event and associated registrations successfully deleted' });
  } catch (error) {
    console.error('Delete event error:', error.message);
    res.status(500).json({ message: 'Server error deleting event', error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent,
};
