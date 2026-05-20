import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  connectionString: config.db_url,
});

export const initDb = async () => {};

export default pool;
