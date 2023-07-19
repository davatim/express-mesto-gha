module.exports = (err, _req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла непредусмотренная ошибка'
        : message,
    });
  return next();
};