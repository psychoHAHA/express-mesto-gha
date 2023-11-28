const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');
const ErrorNotFound = require('../errors/errorNotFound');

router.post('/signup', createUser);
router.post('/signin', login);

router.use('/', auth, userRouter);
router.use('/', cardRouter);
router.use('*', () => {
  throw new ErrorNotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
