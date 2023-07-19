const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const INFO_200_SEC_SEND = 200;
const INFO_201_SEC_REC = 201;
const ERROR_IN_REQUATION = 400;
const ANAUTHORUZED_REQUEST_401 = 401;
// const ERROR_403_PERMISSION = 403;
const ERROR_404_NOTFOUND = 404;
const CODE_CONFLICT = 409;
// const ERROR_505_DEFALT = 500;

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(res.status(ERROR_404_NOTFOUND).send({ message: 'Пользователь не найден на сервере' }));
      }
      res.status(INFO_200_SEC_SEND).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        email: user.email,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(ERROR_IN_REQUATION).send({ message: 'Переданы некорректные данные на сервер' }));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(INFO_200_SEC_SEND).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_IN_REQUATION).send({ message: 'Переданны некорректные данные на сервер' });
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(INFO_201_SEC_REC).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      email: user.email,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(CODE_CONFLICT).send({ message: 'Данный e-mail уже зарегистрирован' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_IN_REQUATION).send({ message: 'Переданны неверные данные' });
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      // Хэш
      if (!user) {
        next(res.status(ANAUTHORUZED_REQUEST_401).send({ message: 'Неправильная почта или пароль' }));
      }
      return bcrypt.compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            next(res.status(ANAUTHORUZED_REQUEST_401).send({ message: 'Неправильная почта или пароль' }));
          }
          const token = jwt.sign({ _id: user._id }, 'super-secret-kei', { expiresIn: '7d' });
          return res.status(INFO_200_SEC_SEND).send({ token });
        });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(INFO_200_SEC_SEND).send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.status(INFO_200_SEC_SEND).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_IN_REQUATION).send({ message: 'Переданны некорректные данные на сервер' });
      } else {
        next(err);
      }
    });
};
