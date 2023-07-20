class ERROR_IN_REQUATION extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = ERROR_IN_REQUATION;
