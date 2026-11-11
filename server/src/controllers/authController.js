const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Usuário já cadastrado com este email.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, phone, password: hashedPassword, role: 'user' });
    return res.status(201).json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt,
    });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Email ou senha incorretos.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email ou senha incorretos.' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.status(200).json({
      token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) { next(error); }
};

const getMe = async (req, res, next) => {
  try { return res.status(200).json(req.user); }
  catch (error) { next(error); }
};

module.exports = { register, login, getMe };