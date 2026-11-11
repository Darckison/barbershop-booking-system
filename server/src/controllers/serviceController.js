const Service = require('../models/Service');

const getAllServices = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { active: true };
    return res.status(200).json(await Service.find(filter).sort({ name: 1 }));
  } catch (error) { next(error); }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado.' });
    return res.status(200).json(service);
  } catch (error) { next(error); }
};

const createService = async (req, res, next) => {
  try { return res.status(201).json(await Service.create(req.body)); }
  catch (error) { next(error); }
};

const updateService = async (req, res, next) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!updatedService) return res.status(404).json({ message: 'Serviço não encontrado.' });
    return res.status(200).json(updatedService);
  } catch (error) { next(error); }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado.' });
    return res.status(200).json({ message: 'Serviço excluído com sucesso.' });
  } catch (error) { next(error); }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };