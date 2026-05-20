import express from "express";
import cors from "cors";
import authRoutes from "../modules/auth/auth.routes";
import issueRoutes from "../modules/issues/issues.routes";
import { notFoundHandler } from "../middlewares/notfound";
import { errorHandler } from "../middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

// error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
