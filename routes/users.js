const router = require("express").Router()
const user = require("../models/user")
const { getUsers, getUsersById, createUser } = require('../controllers/users')

router.get("/", getUsers)

router.get('/:id', getUsersById);

router.post('/', createUser); 

module.exports = router
