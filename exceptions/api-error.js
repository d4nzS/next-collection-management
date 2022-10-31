class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

  static BadRequest(method) {
    return new ApiError(`Expected ${method} request method`, 400);
  }

  static Unauthorized(message) {
    return new ApiError(message, 401);
  }

  static Forbidden() {
    return new ApiError('This user is blocked', 403);
  }

  static NotFound(message) {
    return new ApiError(message, 404);
  }
}

export default ApiError;