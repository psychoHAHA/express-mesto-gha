module.exports.errorHandle = (err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
};
