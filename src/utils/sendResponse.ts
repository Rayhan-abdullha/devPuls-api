import { Response } from "express";

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export const sendResponse = <T>(res: Response, payload: ApiResponse<T>) => {
  const { statusCode, ...responseBody } = payload;

  return res.status(statusCode).json(responseBody);
};
