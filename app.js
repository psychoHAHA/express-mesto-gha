const mongoose = require('mongoose');

const express = require('express');

const router = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
