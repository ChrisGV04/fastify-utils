import type { ZodError, ZodFormattedError } from 'zod';

/**
 * The base structure for every custom error in the app
 */
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeError(): {
    statusCode: number;
    code: string;
    message: string;
    details?: string;
    fieldErrors?: ZodFormattedError<any>;
  };

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

/**
 * Error caused by any invalid request body or params
 */
export class SchemaValidationError extends CustomError {
  readonly statusCode = 400;

  constructor(private error: ZodError) {
    super('Invalid schema provided');
    Object.setPrototypeOf(this, SchemaValidationError.prototype);
  }

  serializeError() {
    const fieldErrors = this.error.format();
    return {
      statusCode: this.statusCode,
      code: 'API_ERR_VALIDATION',
      fieldErrors,
      message: 'Información inválida',
      details: 'Por favor, corrige los errores y vuelve a intenarlo.',
    };
  }
}

/**
 * Generic error caused by any type of error from the user
 * in the requests
 */
export class BadRequestError extends CustomError {
  readonly statusCode = 400;

  constructor(
    private error: string,
    private details?: string,
  ) {
    super(`Bad request error: ${error}`);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() {
    return {
      statusCode: this.statusCode,
      code: 'API_ERR_BAD_REQ',
      message: this.error,
      details: this.details,
    };
  }
}

/**
 * Error caused by a user trying to access resources
 * he should not access
 */
export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor(
    private status: 401 | 403 = 401,
    private error: string = 'No tienes permisos para este recurso',
    private details?: string,
  ) {
    super('Not authorized');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);

    this.statusCode = this.status;
  }

  serializeError() {
    return {
      statusCode: this.statusCode,
      code: this.statusCode === 401 ? 'API_ERR_AUTH_ONLY' : 'API_ERR_UNAUTHORIZED',
      message: this.error,
      details: this.details,
    };
  }
}

/**
 * Error caused when a resource doesn't exist
 */
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(
    private error: string,
    private details?: string,
  ) {
    super(error);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return {
      statusCode: this.statusCode,
      code: 'API_ERR_NOT_FOUND',
      message: this.error,
      details: this.details,
    };
  }
}

/**
 * Generic error caused by any type of internal error
 */
export class UnknownError extends CustomError {
  readonly statusCode = 500;

  constructor(
    private error: string,
    private details?: string,
  ) {
    super(`Internal unknown error: ${error}`);
    Object.setPrototypeOf(this, UnknownError.prototype);
  }

  serializeError() {
    return {
      statusCode: this.statusCode,
      code: 'API_ERR_UNKNOWN',
      message: this.error,
      details: this.details,
    };
  }
}
