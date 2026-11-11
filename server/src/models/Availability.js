const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openTime: {
      type: String,
      default: '09:00',
    },
    closeTime: {
      type: String,
      default: '19:00',
    },
    breakStart: {
      type: String,
      default: '12:00',
    },
    breakEnd: {
      type: String,
      default: '13:00',
    },
  },
  { _id: false }
);

const blockedDateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: 'Folga ou Feriado',
    },
  },
  { _id: true }
);

const availabilitySchema = new mongoose.Schema(
  {
    workingHours: {
      type: [workingHoursSchema],
      required: true,
    },
    blockedDates: {
      type: [blockedDateSchema],
      default: [],
    },
    slotIntervalMinutes: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);