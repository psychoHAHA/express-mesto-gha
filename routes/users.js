const router = require('express').Router();
const {
  getUsers,
  getUsersById,
  getUsersInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.get('/users/me', getUsersInfo);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
