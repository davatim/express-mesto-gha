class CODE_CONFLICT extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = CODE_CONFLICT;
