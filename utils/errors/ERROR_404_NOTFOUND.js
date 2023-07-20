class ERROR_404_NOTFOUND extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = ERROR_404_NOTFOUND;
