const express = require("express")
const mongoose = require("mongoose")
const router = require('./routes')
const { PORT = 3000 } = process.env

const app = express()

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

app.use(express.json())
app.use(router)

mongoose.connect("mongodb://localhost:27017/mestodb")
