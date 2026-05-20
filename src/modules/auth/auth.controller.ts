import { Request, Response } from "express";
import { createUser, loginUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";
export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Name, email and password are required",
      },
      400,
    );
  }
  try {
    const user = await createUser({ name, email, password, role });

    sendResponse(res, {
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: (err as Error).message || "Server error",
        errors: err,
      },
      500,
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Email and password are required",
      },
      400,
    );
  }
  try {
    const user = await loginUser(email, password);

    if (!user) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Invalid email or password",
        },
        401,
      );
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    sendResponse(res, {
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    sendResponse(
      res,
      {
        success: false,
        message: (err as Error).message || "Server error",
        errors: err instanceof Error ? err.message : err,
      },
      500,
    );
  }
};
