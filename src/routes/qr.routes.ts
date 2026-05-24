import { Router } from "express";
import { getSheet, regenerateQR } from "../controllers/qr.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/sheet/:token", getSheet);

router.post("/regenerate", authMiddleware, regenerateQR);

export default router;
