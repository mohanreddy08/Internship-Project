const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true,
    },
    clubName: {
      type: String,
      required: [true, 'Please provide a club name'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide a department'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Workshop', 'Hackathon', 'Fest', 'Seminar'],
      required: [true, 'Please provide an event category'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue'],
      trim: true,
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Please provide maximum capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
