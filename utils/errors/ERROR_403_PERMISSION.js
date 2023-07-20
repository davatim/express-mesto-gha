class ERROR_403_PERMISSION extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ERROR_403_PERMISSION;
