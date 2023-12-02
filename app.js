const mongoose = require('mongoose');

const helmet = require('helmet');

const express = require('express');

const router = require('./routes/index');

const { errorHandle } = require('./middlewares/errorHandler');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(helmet());

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(router);

app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
