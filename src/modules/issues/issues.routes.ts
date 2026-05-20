import express from "express";
import {
  createIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController,
  deleteIssueController,
} from "./issues.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorization } from "../../middlewares/authorization";

const router = express.Router();

// Create a new issue
router.post(
  "/",
  authenticate,
  authorization(["contributor", "maintainer"]),
  createIssueController,
);

// Get all issues with default sorting by newest and optional filters for type and status
router.get("/", getAllIssuesController);

// get single issue by ID
router.get("/:id", getSingleIssueController);

// update issue by ID
router.patch(
  "/:id",
  authenticate,
  authorization(["contributor", "maintainer"]),
  updateIssueController,
);

// delete issue by ID
router.delete(
  "/:id",
  authenticate,
  authorization(["maintainer"]),
  deleteIssueController,
);

export default router;
