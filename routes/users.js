const router = require('express').Router();

const {
  getUser,
  getUserById,
  updateUserInfo,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

const validation = require('../middlewares/validation');

router.get('/', getUser);
router.get('/me', getCurrentUser);
router.get('/:userId', validation.getUserById, getUserById);

router.patch('/me', validation.UserInfo, updateUserInfo);
router.patch('/me/avatar', validation.updateAvatar, updateAvatar);

module.exports = router;
