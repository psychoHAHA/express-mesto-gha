import { Router } from "express"
import { createUser, getUsers, getUsersById } from "../controllers/users"

const userRouter = Router()

userRouter.get("/", getUsers)
userRouter.get("/:userId", getUsersById)
userRouter.post("/", createUser)


export default userRouter