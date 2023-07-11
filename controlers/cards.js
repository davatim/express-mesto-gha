const mongoose = require('mongoose');
const Card = require('../models/card');
// Статусы и значения
const ERROR_IN_REQUATION = 400;
const ERROR_404_NOTFOUND = 404;
const ERROR_505_DEFALT = 500;
const INFO_200_SEC_SEND = 200;
const INFO_201_SEC_REC = 201;

module.exports.getCards = (_req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(ERROR_505_DEFALT)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(INFO_201_SEC_REC).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(ERROR_IN_REQUATION)
          .send({ message: 'Переданны некоректные данные', stack: err.stack });
      } else {
        res
          .status(ERROR_505_DEFALT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then(() => res.status(INFO_200_SEC_SEND).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_IN_REQUATION)
          .send({ message: 'Переданы некоректные данные' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_404_NOTFOUND).send({ message: 'Карточка не найдена' });
      } else {
        res
          .status(ERROR_505_DEFALT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likedCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404_NOTFOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(INFO_200_SEC_SEND).send({ message: 'Карточка понравилась' });
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

module.exports.dislikedCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404_NOTFOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(INFO_200_SEC_SEND).send({ message: 'Карточка не понравилась' });
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
