import { config } from "../config";

const formatStack = (stack?: string) => {
  if (!stack) return null;

  return stack.split("\n").map((line) => line.trim());
};

export const sanitizeError = (err: any) => {
  const isDev = config.node_env === "development";

  return isDev
    ? [
        {
          name: err.name,
          message: err.message,
          stack: formatStack(err.stack),
        },
      ]
    : [
        {
          name: err.name,
          message: err.message,
        },
      ];
};
