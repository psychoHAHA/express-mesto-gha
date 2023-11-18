const user = require('../models/user');

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

const createUser = async (req, res) => {
  try {
    const newUser = await new user(req.body);

    return res.status(201).send(await newUser.save());
  } catch (error) {
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
      { new: true, runValidators: true },
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

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  updateAvatar,
};
