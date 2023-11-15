import card from "../models/card.js"

export const getCards = async (req, res) => {
  try {
    const cards = await card.find({})

    return res.send(cards)
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Server side error", error: error.message })
  }
}

export const createCard = async (req, res) => {
  try {
    const { name, link } = req.body
    const ownerId = req.user
    const newCard = await card.create({ name, link, owner: ownerId })

    return res.status(201).send(await newCard.save())
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Произошла ошибка", error: error.message })
  }
}

export const deleteCard = async (req, res) => {
  try {
    const cardId = req.params.cardId
    const delCard = await card.findByIdAndDelete(cardId)

    if (!delCard) {
      throw new NotFoundError("Карточка не найдена")
    }

    return res.send(delCard)
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

export const likeCard = async (req, res, next) => {
  try {
    const userCard = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )

    if (!userCard) {
      throw new NotFoundError("Карточка не найдена")
    }

    res.send(userCard)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" })
    }
    next(error)
  }
}

export const dislikeCard = async (req, res, next) => {
  try {
    const userCard = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    console.log(userCard)

    console.log(userCard)
    if (!userCard) {
      throw new NotFoundError("Карточка не найдена")
    }

    res.send(userCard)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" })
    }
    next(error)
  }
}
