const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes/router');
const ERROR_404_NOTFOUND = 404;
const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Подключено к MongoDB'))
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
  });

app.use(express.json());
app.use(helmet());

app.use((req, _res, next) => {
  req.user = {
    _id: '64ad5f119f2b7f94f6d49bb8',
  };

  next();
});

app.use(router);
app.use('/', (_req, res) => {
  res.status(ERROR_404_NOTFOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
