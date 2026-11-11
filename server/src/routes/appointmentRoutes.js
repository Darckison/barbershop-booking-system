const router = require('express').Router();
const { getAvailableSlots, createAppointment, getMyAppointments, cancelMyAppointment, getAllAppointmentsAdmin, updateAppointmentStatusAdmin, updateAppointmentAdmin, deleteAppointmentAdmin } = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { appointmentCreateSchema, appointmentUpdateAdminSchema, appointmentStatusSchema } = require('../validators');

router.use(authMiddleware);

router.get('/available-slots', getAvailableSlots);
router.get('/my', getMyAppointments);
router.post('/', validate(appointmentCreateSchema), createAppointment);
router.patch('/:id/cancel', cancelMyAppointment);

router.get('/', roleMiddleware('admin'), getAllAppointmentsAdmin);
router.patch('/:id/status', roleMiddleware('admin'), validate(appointmentStatusSchema), updateAppointmentStatusAdmin);
router.put('/:id', roleMiddleware('admin'), validate(appointmentUpdateAdminSchema), updateAppointmentAdmin);
router.delete('/:id', roleMiddleware('admin'), deleteAppointmentAdmin);

module.exports = router;