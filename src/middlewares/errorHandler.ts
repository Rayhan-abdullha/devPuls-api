import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { sendResponse, ApiResponse } from "../utils/sendResponse";
import { sanitizeError } from "../utils/sanitizeError";

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

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

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
    statusCode = err.statusCode;
    message = err.message;
  } else {
    message = err.message || message;
  }

  const response: ApiResponse<null> = {
    success: false,
    message,
    errors: sanitizeError(err),
  };
  return sendResponse(res, response, statusCode);
};
