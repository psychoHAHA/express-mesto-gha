const { ERROR_INTERNAL_SERVER } = require('../errors/errors');

// module.exports.errorHandle = (err, req, res, next) => {
//   res.status(err.statusCode).send({ message: err.message });
// };

module.exports.errorHandle = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err;

  req
    .statusCode(statusCode)
    .send({
      message:
        statusCode === ERROR_INTERNAL_SERVER ? 'Возникла ошибка' : message,
    });
};
