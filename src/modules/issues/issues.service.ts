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
