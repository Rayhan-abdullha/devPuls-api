import { Request, Response } from "express";
import { createUser, loginUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";
export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Name, email and password are required",
    });
  }
  try {
    const user = await createUser({ name, email, password, role });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: (err as Error).message || "Server error",
      errors: err,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await loginUser(email, password);

    if (!user) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    sendResponse(res, {
      statusCode: 200,
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
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: (err as Error).message || "Server error",
      errors: err instanceof Error ? err.message : err,
    });
  }
};
