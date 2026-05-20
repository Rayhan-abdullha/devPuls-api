import { Request, Response } from "express";
import { createUser, loginUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";
export const signup = async (req: Request, res: Response, next: Function) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Name, email and password are required",
        errors: [
          !name ? { field: "name", message: "Name is required" } : null,
          !email ? { field: "email", message: "Email is required" } : null,
          !password
            ? { field: "password", message: "Password is required" }
            : null,
        ].filter(Boolean),
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
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: Function) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendResponse(
      res,
      {
        success: false,
        message: "Email and password are required",
        errors: [
          !email ? { field: "email", message: "Email is required" } : null,
          !password
            ? { field: "password", message: "Password is required" }
            : null,
        ].filter(Boolean),
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
    next(err);
  }
};
