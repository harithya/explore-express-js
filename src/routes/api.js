import express from "express";
import authController from "../controllers/authController.js";
import { authVerifyMiddleware } from "../middleware/authVerifyMiddleware.js";

const router = express.Router();

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
// authVerifyMiddleware
router.get("/auth/profile", authVerifyMiddleware, authController.profile);

export { router };
