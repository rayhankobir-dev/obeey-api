const ResponseStatus = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  AUTHENTICATION_REQUIRED: 401,
  AUTHENTICATION_FAILED: 403,
  INSUFFICIENT_PERMISSIONS: 403,
  INVALID_CREDENTIALS: 401,
  INVALID_TOKEN: 401,
  TOKEN_EXPIRED: 401,
  TOKEN_REVOKED: 401,
  INVALID_REQUEST: 400,
  RESOURCE_NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  RESOURCE_CONFLICT: 409,
  RESOURCE_GONE: 410,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

class ApiResponse {
  constructor(statusCode, message, errors = []) {
    this.statusCode = statusCode;
    this.message = message;
    // send multiple error messages
    if (errors && errors.length > 0) {
      this.errors = errors;
    }
  }

  prepare(res, response, headers = {}) {
    for (const [key, value] of Object.entries(headers))
      res.setHeader(key, value);
    return res.status(this.statusCode).json(ApiResponse.sanitize(response));
  }

  send(res, headers = {}) {
    return this.prepare(res, this, headers);
  }

  static sanitize(response) {
    const clone = {};
    Object.assign(clone, response);
    delete clone.status;
    for (const i in clone) if (typeof clone[i] === "undefined") delete clone[i];
    return clone;
  }
}

class AuthFailureResponse extends ApiResponse {
  constructor(message = "Authentication Failure") {
    super(ResponseStatus.UNAUTHORIZED, message);
  }
}

class NotFoundResponse extends ApiResponse {
  constructor(message = "Not Found") {
    super(ResponseStatus.NOT_FOUND, message);
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}

class ForbiddenResponse extends ApiResponse {
  constructor(message = "Forbidden", errors) {
    super(ResponseStatus.FORBIDDEN, message, errors);
  }
}

class BadRequestResponse extends ApiResponse {
  constructor(message = "Bad Parameters", errors, code = 400) {
    super(ResponseStatus.BAD_REQUEST, message, errors);
    this.statusCode = code;
  }
}

class InternalErrorResponse extends ApiResponse {
  constructor(message = "Internal Error") {
    super(ResponseStatus.INTERNAL_ERROR, message);
  }
}

class SuccessMsgResponse extends ApiResponse {
  constructor(message, code = 200) {
    super(ResponseStatus.SUCCESS, message);
    this.statusCode = code;
  }
}

class FailureMsgResponse extends ApiResponse {
  constructor(message) {
    super(ResponseStatus.SUCCESS, message);
  }
}

class SuccessResponse extends ApiResponse {
  constructor(message, data, code = 200) {
    super(ResponseStatus.SUCCESS, message);
    this.statusCode = code;
    this.data = data;
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}

class AccessTokenErrorResponse extends ApiResponse {
  constructor(message = "Access token invalid") {
    super(
      StatusCode.INVALID_ACCESS_TOKEN,
      ResponseStatus.UNAUTHORIZED,
      message
    );
    this.instruction = "refresh_token";
  }

  send(res, headers = {}) {
    headers.instruction = this.instruction;
    return super.prepare(res, this, headers);
  }
}

class TokenRefreshResponse extends ApiResponse {
  constructor(message, accessToken, refreshToken) {
    super(ResponseStatus.SUCCESS, message);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}

module.exports = {
  ResponseStatus,
  ApiResponse,
  AuthFailureResponse,
  NotFoundResponse,
  ForbiddenResponse,
  BadRequestResponse,
  InternalErrorResponse,
  SuccessMsgResponse,
  FailureMsgResponse,
  SuccessResponse,
  AccessTokenErrorResponse,
  TokenRefreshResponse,
};
