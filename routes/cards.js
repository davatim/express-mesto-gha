const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const validation = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validation.createCard, createCard);
router.delete('/:cardId', validation.chekIdCard, deleteCard);

router.put('/:cardId/likes', validation.chekIdCard, likeCard);
router.delete('/:cardId/likes', validation.chekIdCard, dislikeCard);

module.exports = router;
