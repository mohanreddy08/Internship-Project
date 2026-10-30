const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  passId: {
    type: String,
    required: [true, 'Pass ID is required'],
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'waitlisted'],
    default: 'confirmed',
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index to prevent duplicate registrations per user per event
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
