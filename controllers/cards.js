const card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await card.find({});

    return res.send(cards);
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'Server side error', error: error.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user;
    const newCard = await card.create({ name, link, owner: ownerId });

    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы не валидные данныые' });
    }
    return res
      .status(500)
      .send({ message: 'Произошла ошибка', error: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const userId = req.params.cardId;
    const delCard = await card.findByIdAndDelete(userId);

    if (!delCard) {
      throw new Error('NotFound');
    }

    return res.send(delCard);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const likeCard = async (req, res) => {
  try {
    const userCard = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!userCard) {
      throw new Error('NotFound');
    }

    res.send(userCard);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по id не найден' });
    }

    if (error.userName === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const userCard = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!userCard) {
      throw new Error('NotFound');
    }

    res.send(userCard);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' });
    }
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по id не найден' });
    }

    if (error.userName === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
