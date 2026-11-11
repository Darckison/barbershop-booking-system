const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do serviço é obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'A duração em minutos é obrigatória'],
      min: [5, 'A duração mínima é de 5 minutos'],
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0, 'O preço não pode ser negativo'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);