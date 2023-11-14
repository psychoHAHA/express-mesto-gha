import express, { json } from "express"
import mongoose from "mongoose"
import router from "./routes"
const app = express()

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env

mongoose.connect(MONGO_URL)

app.get('/', (req, res) => {
  res.status(200).send({message: 'Hello'})
})

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(json())
app.use('/', router)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})