import { sendResponse } from "./../../utils/sendResponse";
import { AuthRequest } from "../../middlewares/authenticate";
import { NextFunction, Response } from "express";
import {
  createIssue,
  getIssues,
  updateIssue,
  getIssueById,
  deleteIssue,
  getUsersByIds,
} from "./issues.service";
import { User } from "../../types";

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
export const getSingleIssueController = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  if (!id) {
    return sendResponse(res, {
      success: false,
      message: "Valid issue ID is required",
    });
  }

  try {
    const issue = await getIssueById(id);

    if (!issue) {
      return sendResponse(res, {
        success: false,
        message: "Issue not found",
      });
    }

    const user = await getUsersByIds([issue.reporter_id]);

    const reporter = user[0]
      ? {
          id: user[0].id,
          name: user[0].name,
          role: user[0].role,
        }
      : null;

    return sendResponse(
      res,
      {
        success: true,
        message: "Issue retrieved successfully",
        data: {
          ...issue,
          reporter,
        },
      },
      200,
    );
  } catch (err) {
    next(err);
  }
};
export const updateIssueController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issueId = Number(req.params.id);
    const user = req.user as User;

    const existing = await getIssueById(issueId);

    if (!existing) {
      return sendResponse(res, {
        success: false,
        message: "Issue not found",
      });
    }

    if (user.role === "contributor") {
      if (existing.reporter_id !== user.id) {
        return sendResponse(res, {
          success: false,
          message: "You can only update your own issues",
        });
      }

      if (existing.status !== "open") {
        return sendResponse(res, {
          success: false,
          message: "Cannot update issue after it is in progress or resolved",
        });
      }
    }

    const updated = await updateIssue(issueId, req.body);

    return sendResponse(res, {
      success: true,
      message: "Issue updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteIssueController = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    const existing = await getIssueById(id);

    if (!existing) {
      return sendResponse(res, {
        success: false,
        message: "Issue not found",
      });
    }

    await deleteIssue(id);

    return sendResponse(res, {
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
