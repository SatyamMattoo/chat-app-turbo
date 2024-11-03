import { Request, Response, NextFunction } from "express";

// Class extends Error to handle errors
class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware for handling errors
export const error = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
