const bcrypt = require('bcryptjs');
const user = require('../models/user');
const generateToken = require('../utils/jwt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;

const getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(500)
      .send({ message: 'Server side error', error: error.message });
  }
};

const getUsersById = async (req, res) => {
  try {
    const userName = await user.findById(req.params.id);

    if (!userName) {
      throw new Error('NotFound');
    }
    res.status(200).send(userName);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по id не найден' });
    }

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
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

const createUser = async (req, res) => {
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
      return res.status(409).send({
        message: 'Такой пользователь уже существует',
        errorCode: error.code,
      });
    }

    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .send({ message: 'Ошибка валидации полей', ...error });
    }
    return res
      .status(500)
      .send({ message: 'Произошла ошибка', error: error.message });
  }
};

const updateUser = async (req, res) => {
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
      return res.status(404).send({ message: 'Пользователь по id не найден' });
    }

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatingAvatar = await user.findByIdAndUpdate(
      req.user._id,
      {
        avatar,
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new Error('NotFound');
    }

    res.send(updatingAvatar);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по id не найден' });
    }

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный id' });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const login = async (req, res) => {
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
      return res
        .status(401)
        .send({ message: 'Неправильные email или password' });
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
