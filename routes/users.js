const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUsersById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
