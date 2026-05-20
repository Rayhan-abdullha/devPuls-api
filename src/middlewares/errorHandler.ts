import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { sendResponse, ApiResponse } from "../utils/sendResponse";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any = null;

  /**
   * JWT Errors
   */
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  /**
   * PostgreSQL Errors
   */

  // UNIQUE constraint violation
  else if (err.code === "23505") {
    statusCode = 409;

    const match = err.detail?.match(/\((.*?)\)=\((.*?)\)/);

    errors = {
      field: match?.[1],
      value: match?.[2],
    };

    message = `${match?.[1] || "Field"} already exists`;
  }

  // FOREIGN KEY violation
  else if (err.code === "23503") {
    statusCode = 400;

    message = "Referenced resource does not exist";

    errors = {
      constraint: err.constraint,
    };
  }

  // NOT NULL violation
  else if (err.code === "23502") {
    statusCode = 400;

    message = `${err.column || "Field"} is required`;

    errors = {
      field: err.column,
    };
  }

  // CHECK constraint violation
  else if (err.code === "23514") {
    statusCode = 400;

    message = "Validation failed";

    errors = {
      constraint: err.constraint,
    };
  }

  // Invalid UUID / invalid input syntax
  else if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid input format";
  }

  // Table does not exist
  else if (err.code === "42P01") {
    statusCode = 500;
    message = "Database table error";
  }

  // Column does not exist
  else if (err.code === "42703") {
    statusCode = 500;
    message = "Database column error";
  }

  // DB connection issue
  else if (err.code === "ECONNREFUSED") {
    statusCode = 503;
    message = "Database connection failed";
  } else if (err.statusCode) {

  /**
   * Custom App Error
   */
    statusCode = err.statusCode;
    message = err.message;
  } else {

  /**
   * Unknown Error
   */
    message = err.message || message;
  }

  /**
   * Development Errors
   */
  if (config.node_env === "development") {
    errors = {
      ...errors,
      stack: err.stack,
      errorName: err.name,
      code: err.code,
      detail: err.detail,
    };
  }

  const response: ApiResponse<null> = {
    success: false,
    message,
    errors,
  };

  return sendResponse(res, response, statusCode);
};
