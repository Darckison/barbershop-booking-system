const User = require('../models/User');

const getAllUsers = async (req, res, next) => {
  try { return res.status(200).json(await User.find().select('-password').sort({ createdAt: -1 })); }
  catch (error) { next(error); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    return res.status(200).json(user);
  } catch (error) { next(error); }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado.' });
    return res.status(200).json(updatedUser);
  } catch (error) { next(error); }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    return res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };