const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUsersById,
  getUsersInfo,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.get('/users/me', getUsersInfo)
router.post('/users/signup', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
router.post('/users/signin', login);

module.exports = router;
