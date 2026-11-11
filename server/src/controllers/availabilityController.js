const Availability = require('../models/Availability');

const getAvailability = async (req, res, next) => {
  try {
    let config = await Availability.findOne();
    if (!config) return res.status(404).json({ message: 'Configuração não inicializada.' });
    return res.status(200).json(config);
  } catch (error) { next(error); }
};

const updateAvailability = async (req, res, next) => {
  try {
    let config = await Availability.findOne();
    if (!config) { config = new Availability(req.body); await config.save(); }
    else {
      if (req.body.slotIntervalMinutes !== undefined) config.slotIntervalMinutes = req.body.slotIntervalMinutes;
      if (req.body.workingHours) config.workingHours = req.body.workingHours;
      await config.save();
    }
    return res.status(200).json(config);
  } catch (error) { next(error); }
};

const addBlockedDate = async (req, res, next) => {
  try {
    const { date, reason } = req.body;
    let config = await Availability.findOne();
    if (!config) return res.status(404).json({ message: 'Configuração não encontrada.' });
    if (config.blockedDates.some((b) => b.date === date)) return res.status(409).json({ message: 'Data já bloqueada.' });
    config.blockedDates.push({ date, reason });
    await config.save();
    return res.status(201).json(config.blockedDates);
  } catch (error) { next(error); }
};

const removeBlockedDate = async (req, res, next) => {
  try {
    let config = await Availability.findOne();
    if (!config) return res.status(404).json({ message: 'Configuração não encontrada.' });
    config.blockedDates = config.blockedDates.filter((b) => b.date !== req.params.date);
    await config.save();
    return res.status(200).json({ message: 'Data desbloqueada.' });
  } catch (error) { next(error); }
};

module.exports = { getAvailability, updateAvailability, addBlockedDate, removeBlockedDate };