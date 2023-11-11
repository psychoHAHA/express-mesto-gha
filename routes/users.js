const router = require("express").Router()
const user = require("../models/user")

router.get("/", (req, res) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
})

router.get("/", (req, res) => {
  
})

module.exports = router
