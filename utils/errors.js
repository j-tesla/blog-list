class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = {
  ValidationError,
  AuthorizationError,
};
