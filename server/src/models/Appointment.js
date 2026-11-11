const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O usuário é obrigatório'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'O serviço é obrigatório'],
    },
    date: {
      type: String,
      required: [true, 'A data é obrigatória'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido. Use YYYY-MM-DD'],
    },
    startTime: {
      type: String,
      required: [true, 'O horário inicial é obrigatório'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de horário inválido. Use HH:mm'],
    },
    endTime: {
      type: String,
      required: [true, 'O horário final é obrigatório'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de horário inválido. Use HH:mm'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'done'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);