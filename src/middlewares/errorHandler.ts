import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { config } from "../config";

interface AppError extends Error {
  statusCode?: number;
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
   * ✅ ZOD VALIDATION ERROR
   */
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";

    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err.name === "JsonWebTokenError") {

  /**
   * 🔐 JWT ERRORS
   */
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.statusCode) {

  /**
   * ⚙️ CUSTOM APPLICATION ERROR
   */
    statusCode = err.statusCode;
    message = err.message;
  }

  /**
   * 📦 FINAL RESPONSE (MATCH sendResponse STYLE)
   */
  const response: any = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  /**
   * 🧠 DEV MODE DEBUGGING ONLY
   */
  if (config.node_env === "development") {
    response.stack = err.stack;
    response.errorName = err.name;
  }

  return res.status(statusCode).json(response);
};
