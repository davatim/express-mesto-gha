const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните поле'],
    minlength: [2, 'Минимальная длина - 2 символа'],
    maxlength: [30, 'Максимальная длина - 30 символов'],
    default: 'Жак Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Заполните поле'],
    minlength: [2, 'Минимальная длина - 2 символа'],
    maxlength: [30, 'Максимальная длина - 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Заполните поле'],
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Поле заполнено неправильно',
    },
  },
  password: {
    type: String,
    required: [true, 'Заполните поле'],
    // Убрать возврат пароля!!!
    select: false,
    minlength: [8, 'Минимальная длина - 8 символов'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
