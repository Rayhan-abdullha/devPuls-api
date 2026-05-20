import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import { sendResponse } from "../utils/sendResponse";

export const authorization = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Unauthorized access",
          },
          401,
        );
      }

      if (!roles.includes(user.role)) {
        return sendResponse(
          res,
          {
            success: false,
            message: "You are not permitted to access this resource",
          },
          403,
        );
      }

      next();
    } catch (error) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Authorization failed",
        },
        500,
      );
    }
  };
};
