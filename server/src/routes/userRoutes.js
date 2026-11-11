const router = require('express').Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { userUpdateAdminSchema } = require('../validators');

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(userUpdateAdminSchema), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;