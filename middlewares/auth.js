const jwt = require('jsonwebtoken');

const ANAUTHORUZED_REQUEST_401 = 401;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(ANAUTHORUZED_REQUEST_401)
      .send({ message: 'Сначала авторизируйтесь' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-kei');
  } catch (err) {
    return res
      .status(ANAUTHORUZED_REQUEST_401)
      .send({ message: 'Пользователь не зарегистрирован' });
  }
  req.user = payload;
  return next();
};