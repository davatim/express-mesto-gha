const router = require('express').Router();

const userRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/cards', cardsRouter);
router.use('/users', userRouter);

module.exports = router;
