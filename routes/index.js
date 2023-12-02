const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');
const ErrorNotFound = require('../errors/errorNotFound');

const { userValidateAuth } = require('../middlewares/userValidation');

router.post('/signup', userValidateAuth, createUser);
router.post('/signin', userValidateAuth, login);

router.use(auth);

router.use('/', userRouter);
router.use('/', cardRouter);
router.use('*', () => {
  throw new ErrorNotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
