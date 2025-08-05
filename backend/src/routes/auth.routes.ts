import express from "express";
import {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  status,
  me,
  logout,
} from "../controllers/auth.controllers";
import { ensureAuthentication } from "../middlewares/auth.Middleware";
import { RegisterData, AppUser, QueryData } from "../models/user.model";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", ...googleAuthCallback);
router.get("/status/:username", status);
router.get("/me", ensureAuthentication, me);
router.get("/logout", logout);

export default router;

