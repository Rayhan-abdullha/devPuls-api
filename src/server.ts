import app from "./app/app";
import { config } from "./config";
import { initDb } from "./db";

const main = async () => {
  try {
    await initDb();
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};
main();
