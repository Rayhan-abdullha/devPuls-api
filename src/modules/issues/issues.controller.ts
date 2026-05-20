import { sendResponse } from "./../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/authenticate";
import { NextFunction, Response } from "express";
import { createIssue, getIssues } from "./issues.service";
import pool from "../../db";
export const createIssueController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, type } = req.body;
  if (!title || !description || !type) {
    return sendResponse(res, {
      success: false,
      message: "Title, description and type are required",
      errors: {
        title: !title ? "Title is required" : undefined,
        description: !description ? "Description is required" : undefined,
        type: !type ? "Type is required" : undefined,
      },
    });
  }
  try {
    const userId = req.user?.id!;

    const issue = await createIssue({ title, description, type }, userId);

    return sendResponse(
      res,
      {
        success: true,
        message: "Issue created successfully",
        data: issue,
      },
      201,
    );
  } catch (err) {
    next(err);
  }
};
export const getAllIssuesController = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sort, type, status } = req.query;

    // fetch issues based on filters
    const issues = await getIssues({ sort, type, status });

    // get unique reporter ids from issues
    const reporterIds = [...new Set(issues.map((i: any) => i.reporter_id))];

    // fetch user details for reporter ids
    const users = await getUsersByIds(reporterIds);

    // create a map of user id to user details for easy lookup
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const formatted = issues.map((issue: any) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: userMap.get(issue.reporter_id)
        ? {
            id: userMap.get(issue.reporter_id).id,
            name: userMap.get(issue.reporter_id).name,
            role: userMap.get(issue.reporter_id).role,
          }
        : null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    }));

    return sendResponse(res, {
      success: true,
      message: "Issues retrieved successfully",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
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
