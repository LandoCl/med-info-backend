import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { authLimiter } from "../config/rateLimit";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validateRequest({ body: registerSchema }),
  register,
);
router.post(
  "/login",
  authLimiter,
  validateRequest({ body: loginSchema }),
  login,
);

export default router;
