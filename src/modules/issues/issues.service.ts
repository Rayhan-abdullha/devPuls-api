import pool from "../../db";
import { IssueCreateDTO } from "../../types";

export const createIssue = async (data: IssueCreateDTO, reporterId: number) => {
  const { title, description, type } = data;

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, status, reporter_id)
    VALUES ($1, $2, $3, 'open', $4)
    RETURNING *
    `,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};
export const getIssues = async (filters: {
  type?: "bug" | "feature_request";
  status?: "open" | "closed";
  sort?: "newest" | "oldest";
}) => {
  let query = `SELECT * FROM issues WHERE 1=1`;
  const values: ("bug" | "feature_request" | "open" | "closed")[] = [];

  if (filters.type) {
    values.push(filters.type);
    query += ` AND type = $${values.length}`;
  }

  if (filters.status) {
    values.push(filters.status);
    query += ` AND status = $${values.length}`;
  }

  const sortOrder = filters.sort === "oldest" ? "ASC" : "DESC";

  query += ` ORDER BY created_at ${sortOrder}`;

  // ex: final query SELECT * FROM issues WHERE 1=1 AND type = $1 AND status = $2 ORDER BY created_at DESC
  // values = ["bug" | "feature_request" | "open" | "closed"]
  const result = await pool.query(query, values);

  return result.rows;
};
export const getIssueById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  return result.rows[0];
};
export const updateIssue = async (id: number, data: any) => {
  const { title, description, type } = data;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
    [title, description, type, id],
  );

  return result.rows[0];
};
export const deleteIssue = async (id: number) => {
  await pool.query(`DELETE FROM issues WHERE id = $1`, [id]);

  return true;
};
export const getUsersByIds = async (ids: number[]) => {
  if (!ids.length) return [];

  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");

  const result = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id IN (${placeholders})
    `,
    ids,
  );

  return result.rows;
};
