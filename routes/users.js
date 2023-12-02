const router = require('express').Router();
const { userValidateId, userValidateInfo, userValidateAvatar } = require('../middlewares/userValidation');

const {
  getUsers,
  getUsersById,
  getUsersInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUsersInfo);
router.get('/users/:id', userValidateId, getUsersById);
router.patch('/users/me', userValidateInfo, updateUser);
router.patch('/users/me/avatar', userValidateAvatar, updateAvatar);

module.exports = router;
