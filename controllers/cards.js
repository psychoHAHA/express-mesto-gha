const card = require('../models/card');
const ErrorForbiden = require('../errors/errorForbidden');
const ErrorValidation = require('../errors/errorValidation');
const ErrorNotFound = require('../errors/errorNotFound');

const getCards = async (req, res, next) => {
  try {
    const cards = await card.find({});

    res.send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user;
    const newCard = await card.create({ name, link, owner: ownerId });

    res.send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ErrorValidation('Ошибка валидации полей'));
    }

    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newCardId = req.params.cardId;
    const findCard = await card
      .findById(newCardId)
      .orFail(() => new ErrorNotFound('Карточка для удаления не найдена'));

    if (!findCard.owner.equals(userId)) {
      throw new ErrorForbiden('Вы не можете удалить чужую карточку');
    } else {
      const delCard = await card.deleteOne({ _id: newCardId });
      res.send(delCard);
    }
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
      { new: true }
    );

    if (!userCard) {
      throw new ErrorNotFound('Карточка не найдена');
    }

    res.send(userCard);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));
    }

    next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const userCard = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!userCard) {
      throw new ErrorNotFound('Карточка не найдена');
    }

    res.send(userCard);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));

      return;
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
