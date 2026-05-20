import express from "express";
import {
  createIssueController,
  getAllIssuesController,
} from "./issues.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorization } from "../../middlewares/authorization";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorization(["contributor", "maintainer"]),
  createIssueController,
);
router.get("/", getAllIssuesController);

export default router;
