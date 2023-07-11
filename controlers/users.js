const mongoose = require('mongoose');
const User = require('../models/user');

const ERROR_IN_REQUATION = 400;
const ERROR_404_NOTFOUND = 404;
const ERROR_505_DEFALT = 500;
const INFO_201_SEC_REC = 201;
const INFO_200_SEC_SEND = 200;

module.exports.getUsers = (_req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res
      .status(ERROR_505_DEFALT)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_404_NOTFOUND)
          .send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_IN_REQUATION)
          .send({ message: 'Переданы некоректные данные' });
      } else {
        res
          .status(ERROR_505_DEFALT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(INFO_200_SEC_SEND).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(ERROR_IN_REQUATION)
          .send({ message: 'Переданны некоректные данные' });
      } else {
        res
          .status(ERROR_505_DEFALT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(INFO_201_SEC_REC).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(ERROR_IN_REQUATION)
          .send({ message: 'Переданны некоректные данные' });
      } else {
        res
          .status(ERROR_505_DEFALT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(INFO_200_SEC_SEND).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(ERROR_IN_REQUATION)
          .send({ message: 'Переданны некоректные данные' });
      } else {
        res
          .status(ERROR_505_DEFALT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
