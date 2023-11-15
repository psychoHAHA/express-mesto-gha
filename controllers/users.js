import user from "../models/user.js"

export const getUsers = async (req, res) => {
  try {
    const users = await user.find({})
    return res.send(users)
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Server side error", error: error.message })
  }
}

export const getUsersById = async (req, res) => {
  try {
    console.log(req.params.id)
    const userName = await user.findById(req.params.id)
    console.log(userName)

    if (!userName) {
      throw new Error("NotFound")
    }
    res.status(200).send(userName)
    
  } catch (error) {
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Пользователь по id не найден" })
    }

    if (error.userName === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" })
    }

    return res.status(500).send({ message: "Ошибка на стороне сервера" })
  }
}

export const createUser = async (req, res) => {
  try {
    const newUser = await new user(req.body)

    return res.status(201).send(await newUser.save())
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Ошибка валидации полей", ...error })
    }

    if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
      return res.status(409).send({ message: "Пользователь уже существует" })
    }
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body
    const updatingUser = await user.findByIdAndUpdate(
      req.user._id, { name, about }
    )

    if (!updateUser) {
      throw new NotFoundError('Пользователь с данным id не найден')
    }

    res.send(updatingUser)
  } catch (error) {
    next(error)
  }
}

export const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body
    const updatingAvatar = await user.findByIdAndUpdate(
      req.user._id, { avatar }
    )

    if (!user) {
      throw new NotFoundError('Пользователь с данным id не найден')
    }

    res.send(updatingAvatar)
  } catch (error) {
    next(error)
  }
}
