const router = require('express').Router();
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { serviceSchema } = require('../validators');

router.use(authMiddleware);

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', roleMiddleware('admin'), validate(serviceSchema), createService);
router.put('/:id', roleMiddleware('admin'), validate(serviceSchema), updateService);
router.delete('/:id', roleMiddleware('admin'), deleteService);

module.exports = router;