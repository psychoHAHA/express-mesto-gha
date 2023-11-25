const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

// const handleAuthError = (res) => {
//   res.status(401).send({ message: 'Необходима авторизация' });
// };

// const extractBearerToken = (header) => {
//   return header.replace('Bearer ', '');
// };

// const auth = (req, res, next) => {

// }

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies;
    if (!token) {
      throw new Error('Необходима авторизация');
    }

    const validToken = token.replace('Bearer', '');
    payload = jwt.verify(validToken, NODE_ENV ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    if (error.message === 'Необходима авторизация') {
      return res
        .status(401)
        .send({ message: 'Не правильные email или password' });
    }

    if (error.name === 'JsonWebToken') {
      return res.status(401).send({ message: 'С токеном что-то не так' });
    }

    return res.status(500).send(error);
  }

  req.user = payload;
  next();
};
