const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const { timeToMinutes, minutesToTime, checkOverlap, generateDailySlots } = require('../utils/slots');

const getAvailableSlots = async (req, res, next) => {
  try {
    const { date, serviceId } = req.query;
    if (!date || !serviceId) return res.status(400).json({ message: 'date e serviceId são obrigatórios.' });
    const service = await Service.findById(serviceId);
    if (!service || !service.active) return res.status(404).json({ message: 'Serviço não encontrado ou inativo.' });
    const config = await Availability.findOne();
    if (!config) return res.status(500).json({ message: 'Configuração ausente.' });
    const appointments = await Appointment.find({ date, status: { $ne: 'cancelled' } });
    
    // CORRIGIDO AQUI: Number(service.durationMinutes)
    return res.status(200).json(generateDailySlots({ dateStr: date, serviceDuration: Number(service.durationMinutes), availabilityConfig: config, existingAppointments: appointments }));
  } catch (error) { next(error); }
};

const createAppointment = async (req, res, next) => {
  try {
    const { serviceId, date, startTime, notes } = req.body;
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    if (date < today) return res.status(400).json({ message: 'Data passada não permitida.' });

    const service = await Service.findById(serviceId);
    if (!service || !service.active) return res.status(404).json({ message: 'Serviço indisponível.' });
    const config = await Availability.findOne();
    if (!config) return res.status(500).json({ message: 'Configuração ausente.' });

    if (config.blockedDates.some((b) => b.date === date)) return res.status(400).json({ message: 'Barbearia fechada na data.' });

    const [year, month, day] = date.split('-').map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const daySchedule = config.workingHours.find((w) => w.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.isOpen) return res.status(400).json({ message: 'Fechado neste dia da semana.' });

    const startMin = timeToMinutes(startTime);
    // CORRIGIDO AQUI: Number(service.durationMinutes)
    const endMin = startMin + Number(service.durationMinutes);
    const endTime = minutesToTime(endMin);

    const openMin = timeToMinutes(daySchedule.openTime);
    const closeMin = timeToMinutes(daySchedule.closeTime);
    const breakStartMin = timeToMinutes(daySchedule.breakStart);
    const breakEndMin = timeToMinutes(daySchedule.breakEnd);

    if (startMin < openMin || endMin > closeMin) return res.status(400).json({ message: 'Fora do expediente.' });
    if (checkOverlap(startMin, endMin, breakStartMin, breakEndMin)) return res.status(400).json({ message: 'Conflito com horário de almoço.' });

    const existing = await Appointment.find({ date, status: { $ne: 'cancelled' } });
    const hasCollision = existing.some((appt) => checkOverlap(startMin, endMin, timeToMinutes(appt.startTime), timeToMinutes(appt.endTime)));
    if (hasCollision) return res.status(409).json({ message: 'Conflito de horário: este intervalo já foi reservado.' });

    const appointment = await Appointment.create({ user: userId, service: serviceId, date, startTime, endTime, notes: notes || '', status: 'pending' });
    const populated = await Appointment.findById(appointment._id).populate('user', 'name email phone').populate('service', 'name price durationMinutes');
    
    const io = req.app.get('io');
    if (io) {
      io.emit('novo-agendamento', { 
        mensagem: 'Novo agendamento recebido na barbearia!' 
      });
    }

    return res.status(201).json(populated);
  } catch (error) { next(error); }
};

const getMyAppointments = async (req, res, next) => {
  try { return res.status(200).json(await Appointment.find({ user: req.user._id }).populate('service', 'name price durationMinutes').sort({ date: -1, startTime: -1 })); }
  catch (error) { next(error); }
};

const cancelMyAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
    if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado.' });
    if (appointment.status === 'cancelled') return res.status(400).json({ message: 'Já cancelado.' });
    if (appointment.status === 'done') return res.status(400).json({ message: 'Não é possível cancelar concluído.' });
    appointment.status = 'cancelled';
    await appointment.save();
    return res.status(200).json({ message: 'Cancelado.', appointment });
  } catch (error) { next(error); }
};

const getAllAppointmentsAdmin = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (status) filter.status = status;
    return res.status(200).json(await Appointment.find(filter).populate('user', 'name email phone').populate('service', 'name price durationMinutes').sort({ date: 1, startTime: 1 }));
  } catch (error) { next(error); }
};

const updateAppointmentStatusAdmin = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Não encontrado.' });
    appointment.status = req.body.status;
    await appointment.save();
    return res.status(200).json(appointment);
  } catch (error) { next(error); }
};

const updateAppointmentAdmin = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Não encontrado.' });
    const service = await Service.findById(req.body.serviceId || appointment.service);
    if (!service) return res.status(404).json({ message: 'Serviço não existe.' });

    const targetDate = req.body.date || appointment.date;
    const targetStartTime = req.body.startTime || appointment.startTime;
    const startMin = timeToMinutes(targetStartTime);
    // CORRIGIDO AQUI: Number(service.durationMinutes)
    const endMin = startMin + Number(service.durationMinutes);

    const existing = await Appointment.find({ _id: { $ne: appointment._id }, date: targetDate, status: { $ne: 'cancelled' } });
    const hasCollision = existing.some((appt) => checkOverlap(startMin, endMin, timeToMinutes(appt.startTime), timeToMinutes(appt.endTime)));
    if (hasCollision) return res.status(409).json({ message: 'Conflito de horário.' });

    appointment.service = service._id;
    appointment.date = targetDate;
    appointment.startTime = targetStartTime;
    appointment.endTime = minutesToTime(endMin);
    if (req.body.status) appointment.status = req.body.status;
    if (req.body.notes !== undefined) appointment.notes = req.body.notes;
    await appointment.save();

    return res.status(200).json(await Appointment.findById(appointment._id).populate('user', 'name email phone').populate('service', 'name price durationMinutes'));
  } catch (error) { next(error); }
};

const deleteAppointmentAdmin = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Não encontrado.' });
    return res.status(200).json({ message: 'Removido.' });
  } catch (error) { next(error); }
};

module.exports = { getAvailableSlots, createAppointment, getMyAppointments, cancelMyAppointment, getAllAppointmentsAdmin, updateAppointmentStatusAdmin, updateAppointmentAdmin, deleteAppointmentAdmin };