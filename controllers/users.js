import user from "../models/user"

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
    const { userId } = req.params
    const user = await user.findById(userId)
    if (!user) {
      throw new Error("NotFound")
    }
    res.status(200).send(user)
    console.log("getUserById")
  } catch (error) {
    if (error.message === "NotFound") {
      return res.status(404).send({ message: "Пользователь по id не найден" })
    }

    if (error.name === "CastError") {
      return res.status(400).send({ message: "Передан не валидный id" })
    }

    return res.status(500).send({ message: "Ошибка на стороне сервера" })
  }
}

export const createUser = async (req, res) => {
  try {
    console.log(req.body)
    const newUser = await user(req.body)

    return res.status(201).send(await newUser.save())
  } catch (error) {
    console.log(error)
  }
}
