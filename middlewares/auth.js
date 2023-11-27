const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies;
    if (!token) {
      throw new Error('NotAutanticate');
    }

    const validToken = token.replace('Bearer', '');
    payload = jwt.verify(validToken, NODE_ENV ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    if (error.message === 'NotAutanticate') {
      return res
        .status(401)
        .send({ message: 'Неправильные email или password' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'С токеном что-то не так' });
    }

    return res.status(500).send(error);
  }

  req.user = payload;
  next();
};
