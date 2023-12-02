const card = require('../models/card');
const ErrorForbiden = require('../errors/errorForbidden');
const ErrorValidation = require('../errors/errorValidation');
const ErrorNotFound = require('../errors/errorNotFound');

const getCards = async (req, res, next) => {
  try {
    const cards = await card.find({});

    return res.send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user;
    const newCard = await card.create({ name, link, owner: ownerId });

    return res.status(201).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ErrorValidation('Ошибка валидации полей');
    }

    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cardId = req.params.cardId;
    const findCard = await card.findById(cardId).orFail();

    if (!findCard.owner.equals(userId)) {
      throw new ErrorForbiden('Вы не можете удалить чужую карточку');
    } else {
      const delCard = await card.deleteOne({_id: cardId }).orFail();
      return res.send(delCard);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ErrorValidation('Ошибка валидации полей');
    }

    next(error);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const userCard = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!userCard) {
      throw new ErrorNotFound('Карточка не найдена');
    }

    res.send(userCard);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new ErrorValidation('Ошибка валидации полей');
    }

    next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const userCard = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!userCard) {
      throw new ErrorNotFound('Карточка не найдена');
    }

    res.send(userCard);
  } catch (error) {
    if (error.name === 'CastError') {
      throw new ErrorValidation('Ошибка валидации полей');
    }

    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
