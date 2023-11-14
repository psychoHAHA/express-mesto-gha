import { Router } from "express"
import { createUser, getUsers, getUsersById } from "../controllers/users"

const userRouter = Router()

userRouter.get("/users", getUsers)
userRouter.get("/users/:id", getUsersById)
userRouter.post("/users", createUser)


export default userRouter