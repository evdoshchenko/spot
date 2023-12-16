import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { constants } from 'http2';

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

export const errorResponder = (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction) => {
    response.header("Content-Type", 'application/json')

    const { statusCode = constants.HTTP_STATUS_BAD_REQUEST, message } = error;

    response
      .status(statusCode)
      .send({
        message: statusCode === constants.HTTP_STATUS_BAD_REQUEST
          ? 'На сервере произошла ошибка'
          : message
      });
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}
