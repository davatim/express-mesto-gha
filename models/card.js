const mongoose = require('mongoose');

const cardShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Заполните поле'],
      minlength: [2, 'Минимальная длина - 2 символа'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Заполните поле'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Заполните поле'],
      ref: 'user',
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardShema);
