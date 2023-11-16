const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/', userRouter);
router.use('/', cardRouter);
router.use('*', (res, req) => {
  res.statusCode(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
