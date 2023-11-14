// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

const express = require('express')
const mongoose = require('mongoose')
const router = require("./routes/users")
const { PORT = 3000 } = process.env

const app = express()
mongoose.connect("mongodb://localhost:27017/mestodb")

// app.use(json())
app.use(router)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

