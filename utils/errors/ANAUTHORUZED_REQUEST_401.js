class ANAUTHORUZED_REQUEST_401 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = ANAUTHORUZED_REQUEST_401;
