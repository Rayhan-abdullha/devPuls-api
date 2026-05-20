import pool from "../../db";
import { hashPassword, comparePassword } from "../../utils/hash";
import { User } from "../../types";
export const createUser = async (
  data: Omit<User, "id" | "created_at" | "updated_at">,
) => {
  const existing = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    data.email,
  ]);

  if (existing.rows[0]) {
    throw new Error("User with this email already exists");
  }
  const hashed = await hashPassword(data.password);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [data.name, data.email, hashed, data.role || "contributor"],
  );

  return result.rows[0];
};

export const loginUser = async (email: string, password: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  if (!user.rows[0]) return null;

  const valid = await comparePassword(password, user.rows[0].password);
  if (!valid) return null;

  return user.rows[0];
};
