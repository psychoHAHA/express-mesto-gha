const user = require("../models/user")

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }))
}

module.exports.getUsersById = (req, res) => {
  user
    .findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }))
}

module.exports.createUser = (req, res) => {
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя

  user.create({ name, about }); // создадим документ на основе пришедших данных
};