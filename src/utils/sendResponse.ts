import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export const sendResponse = <T>(
  res: Response,
  payload: ApiResponse<T>,
  status: number = 200,
) => {
  const { ...responseBody } = payload;

  return res.status(status).json(responseBody);
};
