const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(8).max(20).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const serviceSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().allow('', null),
  durationMinutes: Joi.number().integer().min(5).max(480).required(),
  price: Joi.number().precision(2).min(0).required(),
  active: Joi.boolean().default(true),
});

const appointmentCreateSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  notes: Joi.string().allow('', null),
});

const appointmentUpdateAdminSchema = Joi.object({
  serviceId: Joi.string().hex().length(24),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'done'),
  notes: Joi.string().allow('', null),
});

const appointmentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'done').required(),
});

const availabilityUpdateSchema = Joi.object({
  slotIntervalMinutes: Joi.number().integer().min(10).max(120),
  workingHours: Joi.array().items(Joi.object({
    dayOfWeek: Joi.number().integer().min(0).max(6).required(),
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    closeTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    breakStart: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    breakEnd: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  })).min(7).max(7),
});

const blockedDateSchema = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  reason: Joi.string().trim().max(120).allow(''),
});

const userUpdateAdminSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  email: Joi.string().email(),
  phone: Joi.string().trim(),
  role: Joi.string().valid('admin', 'user'),
});

module.exports = {
  registerSchema, loginSchema, serviceSchema, appointmentCreateSchema,
  appointmentUpdateAdminSchema, appointmentStatusSchema, availabilityUpdateSchema,
  blockedDateSchema, userUpdateAdminSchema,
};