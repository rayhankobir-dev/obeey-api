const {
  AuthFailureResponse,
  AccessTokenErrorResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
} = require("./ApiResponse");

const ErrorType = {
  NOT_FOUND: "NotFoundError",
  UNAUTHORIZED: "AuthFailureError",
  FORBIDDEN: "ForbiddenError",
  BAD_REQUEST: "BadRequestError",
  BAD_TOKEN: "BadTokenError",
  TOKEN_EXPIRED: "TokenExpiredError",
  ACCESS_TOKEN: "AccessTokenError",
  INTERNAL_ERROR: "InternalError",
  NO_ENTRY: "NoEntryError",
  NO_DATA: "NoDataError",
};

class ApiError extends Error {
  constructor(type, message = "error", errors = []) {
    super(type);
    this.type = type;
    this.message = message;
    this.errors = errors;
  }

  static handle(err, res) {
    switch (err.type) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message, err.errors).send(res);
      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(err.message, err.errors).send(res);
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message, err.errors).send(res);
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message, err.errors).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message, err.errors).send(res);
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message, err.errors).send(res);
      default: {
        let message = err.message;
        return new InternalErrorResponse(message, err.errors).send(res);
      }
    }
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(ErrorType.NOT_FOUND, message);
  }
}

class AuthFailureError extends ApiError {
  constructor(message = "Invalid Credentials") {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Permission denied", errors = []) {
    super(ErrorType.FORBIDDEN, message, errors);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad request", errors = []) {
    super(ErrorType.BAD_REQUEST, message, errors);
  }
}

class BadTokenError extends ApiError {
  constructor(message = "Token is not valid") {
    super(ErrorType.BAD_TOKEN, message);
  }
}

class TokenExpiredError extends ApiError {
  constructor(message = "Token is expired") {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

class AccessTokenError extends ApiError {
  constructor(message = "Invalid access token") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

class InternalError extends ApiError {
  constructor(message = "Internal server error") {
    super(ErrorType.INTERNAL_ERROR, message);
  }
}

class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(ErrorType.NO_ENTRY, message);
  }
}

class NoDataError extends ApiError {
  constructor(message = "No data available") {
    super(ErrorType.NO_DATA, message);
  }
}

module.exports = {
  ErrorType,
  ApiError,
  AuthFailureError,
  InternalError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  NoEntryError,
  BadTokenError,
  TokenExpiredError,
  NoDataError,
  AccessTokenError,
};
