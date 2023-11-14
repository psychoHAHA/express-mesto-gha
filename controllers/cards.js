// const card = require("../models/card")

// module.exports.getCards = (req, res) => {
//   card
//     .find({})
//     .then((users) => res.send(users))
//     .catch(() => res.status(500).send({ message: "Произошла ошибка" }))
// }

// module.exports.createCard = (req, res) => {
//   const { name, link } = req.body
//   card
//     .create({ name, link })
//     .then((card) => res.send(card))
//     .catch(() => res.status(500).send({ message: "Произошла ошибка" }))
// }

// module.exports.deleteCard = (req, res) => {
  
// }

// module.exports.likeCard = (req, res) =>
//   card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//     { new: true }
//   )

// module.exports.dislikeCard = (req, res) =>
//   card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true }
//   )

//   module.exports = router