const User = require('../models/User');
const Appointment = require('../models/Appointment');

const getDashboardStats = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const totalClients = await User.countDocuments({ role: 'user' });
    const todayAppointments = await Appointment.find({ date: todayStr }).populate('user', 'name phone').populate('service', 'name price durationMinutes');
    
    const statusCounts = await Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const appointmentsByStatus = { pending: 0, confirmed: 0, cancelled: 0, done: 0 };
    statusCounts.forEach((sc) => { appointmentsByStatus[sc._id] = sc.count; });

    const topServices = await Appointment.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$service', totalBookings: { $sum: 1 } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'serviceDetails' } },
      { $unwind: '$serviceDetails' },
      { $project: { _id: 1, name: '$serviceDetails.name', totalBookings: 1 } }
    ]);

    const revenueAggregate = await Appointment.aggregate([
      { $match: { status: { $in: ['confirmed', 'done'] } } },
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceInfo' } },
      { $unwind: '$serviceInfo' },
      { $group: { _id: null, totalRevenue: { $sum: '$serviceInfo.price' } } }
    ]);

    const estimatedRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].totalRevenue : 0;

    return res.status(200).json({ totalClients, todayAppointmentsCount: todayAppointments.length, todayAppointments, appointmentsByStatus, topServices, estimatedRevenue });
  } catch (error) { next(error); }
};

module.exports = { getDashboardStats };