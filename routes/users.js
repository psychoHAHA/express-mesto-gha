import { Router } from "express"
import {
  createUser,
  getUsers,
  getUsersById,
  updateUser,
  updateAvatar,
} from "../controllers/users"

const userRouter = Router()

userRouter.get("/users", getUsers)
userRouter.get("/users/:id", getUsersById)
userRouter.post("/users", createUser)
userRouter.patch("/users/me", updateUser)
userRouter.patch("/users/me/avatar", updateAvatar)

export default userRouter
