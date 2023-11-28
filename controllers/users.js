const bcrypt = require('bcryptjs');
const user = require('../models/user');
const generateToken = require('../utils/jwt');

const ErrorNotFound = require('../errors/errorNotFound');
const ErrorValidation = require('../errors/errorValidation');
const ErrorConflict = require('../errors/errorConflict');
const ErrorAuth = require('../errors/errorAuth');

const MONGO_DUPLICATE_ERROR_CODE = 11000;

const getUsers = async (req, res, next) => {
  try {
    const users = await user.find({});
    return res.send(users);
  } catch (error) {
    next(error);
  }
};

const getUsersById = async (req, res, next) => {
  try {
    const userName = await user.findById(req.params.id);

    if (!userName) {
      throw new ErrorNotFound('NotFound');
    }
    res.status(200).send(userName);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));
    }

    next(error);
  }
};

const getUsersInfo = async (req, res, next) => {
  try {
    const userName = await user
      .findById(req.body._id)
      .orFail(() => new Error('Пользователь с указанным id не найден'));
    res.status(200).send(userName);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userName = await user.create({
      name,
      about,
      avatar,
      email,
      password: passwordHash,
    });

    res.status(200).send({
      user: {
        name: userName.name,
        about: userName.about,
        avatar: userName.avatar,
        email: userName.email,
      },
    });
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      next(new ErrorConflict('Такой пользователь уже существует'));
    }

    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));
    }

    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatingUser = await user.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      throw new Error('NotFound');
    }

    res.send(updatingUser);
  } catch (error) {
    if (error.message === 'NotFound') {
      next(new ErrorNotFound('Пользователь по ID не найден'));
    }

    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatingAvatar = await user.findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('NotFound');
    }

    res.send(updatingAvatar);
  } catch (error) {
    if (error.message === 'NotFound') {
      next(new ErrorNotFound('Пользователь по ID не найден'));
    }

    if (error.name === 'CastError') {
      next(new ErrorValidation('Ошибка валидации полей'));
    }

    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userName = await user
      .findOne({ email })
      .select('+password')
      .orFail(() => new Error('NotAutanticate'));

    const matched = await bcrypt.compare(String(password), userName.password);

    if (!matched) {
      throw new Error('NotAutanticate');
    }

    const token = generateToken({
      _id: userName._id,
      email: userName.email,
    });
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 360000,
    });

    res.send({ token: token });
  } catch (error) {
    if (error.message === 'NotAutanticate') {
      next(new ErrorAuth('Неправильные email или password'));
    }

    return res.status(500).send(error);
  }
};

module.exports = {
  getUsers,
  getUsersById,
  getUsersInfo,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
