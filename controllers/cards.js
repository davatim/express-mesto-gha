const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  ERROR_IN_REQUATION,
  ERROR_403_PERMISSION,
  ERROR_404_NOTFOUND,
} = require('../utils/errors/errors');

const INFO_200_SEC_SEND = 200;
const INFO_201_SEC_REC = 201;
// const ERROR_IN_REQUATION = 400;
// const ANAUTHORUZED_REQUEST_401 = 401;
// const ERROR_403_PERMISSION = 403;
// const ERROR_404_NOTFOUND = 404;
// const CODE_CONFLICT = 409;
// const ERROR_505_DEFALT = 500;

module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(INFO_201_SEC_REC).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ERROR_IN_REQUATION('Переданы некорректные данные на сервер'));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();
      const user = req.user._id.toString();
      if (owner === user) {
        return Card.deleteOne(card)
          .then(() =>
            res.status(INFO_200_SEC_SEND).send({ message: 'Карточка с данными удалена' }));
      }
      return next(new ERROR_403_PERMISSION('У вас нет прав для этого'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ERROR_IN_REQUATION('Переданы некорректные данные на сервер'));
      } if (err.name === 'DocumentNotFoundError') {
        next(new ERROR_404_NOTFOUND('Карточка не была найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ERROR_404_NOTFOUND('Карточка не была найдена'));
      }
      res.status(INFO_200_SEC_SEND).send({ message: 'Карточка нравится' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ERROR_IN_REQUATION('Переданы некорректные данные на сервер'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ERROR_404_NOTFOUND('Карточка не была найдена'));
      }
      res.status(INFO_200_SEC_SEND).send({ message: 'Карточка не нравится' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ERROR_IN_REQUATION('Переданы некорректные данные на сервер'));
      }
      next(err);
    });
};
