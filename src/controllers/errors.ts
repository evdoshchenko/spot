import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

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

    const { statusCode = 500, message } = error;

    response
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message
      });
}
