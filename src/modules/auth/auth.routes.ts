import express from "express";
import { signup, login } from "./auth.controller";
import { validate } from "../../../../assignment/src/middlewares/validate";
import { registerSchema, loginSchema } from "./auth.validation";

const router = express.Router();

router.post("/signup", validate(registerSchema), signup);
router.post("/login", validate(loginSchema), login);

export default router;
