const router = require('express').Router();
const { getAvailability, updateAvailability, addBlockedDate, removeBlockedDate } = require('../controllers/availabilityController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { availabilityUpdateSchema, blockedDateSchema } = require('../validators');

router.use(authMiddleware);

router.get('/', getAvailability);
router.put('/', roleMiddleware('admin'), validate(availabilityUpdateSchema), updateAvailability);
router.post('/blocked-dates', roleMiddleware('admin'), validate(blockedDateSchema), addBlockedDate);
router.delete('/blocked-dates/:date', roleMiddleware('admin'), removeBlockedDate);

module.exports = router;