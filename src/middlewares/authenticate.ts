import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../types";
import { sendResponse } from "../utils/sendResponse";

export interface AuthRequest<T = User> extends Request {
  user?: T;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(res, {
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return sendResponse(res, {
        success: false,
        message: "Token not provided",
      });
    }

    const decoded = verifyToken(token) as User;

    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Invalid or expired token",
      },
      401,
    );
  }
};
