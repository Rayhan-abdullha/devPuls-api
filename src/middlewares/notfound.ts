import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error = new Error(
    `Cannot find matching route for [${req.method}] ${req.originalUrl} on this server.`,
  );
  (error as any).statusCode = 404;

  // Forwarding to the global error boundary below
  next(error);
};
