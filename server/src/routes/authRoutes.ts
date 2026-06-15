import { Router } from "express";

import { registerUser, loginUser, getCurrentUser } from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.get("/me", authenticateUser, getCurrentUser);
router.post("/login", loginUser);
export default router;
