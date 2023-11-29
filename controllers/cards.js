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
      next(new ErrorValidation('Ошибка валидации полей'));
    }

    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const userId = req.params.cardId;
    const delCard = await card.findByIdAndDelete(userId);
    const ownerId = req.user;

    if (!delCard) {
      throw new Error('NotFound');
    }

    if (userId !== ownerId) {
      throw new ErrorForbiden('Вы не можете удалить чужую карточку');
    }

    return res.send(delCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ErrorValidation('Ошибка валидации полей'));
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
      throw new Error('NotFound');
    }

    res.send(userCard);
  } catch (error) {
    if (error.message === 'NotFound') {
      next(new ErrorNotFound('Пользователь по ID не найден'));
    }

    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));

      return;
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
      throw new Error('NotFound');
    }

    res.send(userCard);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));

      return;
    }
    if (error.message === 'NotFound') {
      next(new ErrorNotFound('Пользователь по ID не найден'));
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
