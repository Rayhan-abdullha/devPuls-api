import doenv from "dotenv";
import path from "path";

doenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  db_url: process.env.DB_URL || "",
  port: process.env.PORT || 3000,
  jwt_secret: process.env.JWT_SECRET || "",
  node_env: process.env.NODE_ENV || "development",
};

export { config };
