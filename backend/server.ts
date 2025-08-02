import express, { Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import bcrypt from "bcrypt";
import authRoutes from "./src/routes/auth.routes";
import { users, AppUser } from "./src/services/databases";
import "./services/passport";
import { ensureAuthentication } from "./src/middlewares/auth.Middleware";
import {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  status,
  me,
  logout,
} from "./src/controllers/auth.controllers";

// Optional: Keep at top if not moved to a separate .d.ts file
declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

type RegisterData = Pick<AppUser, "username" | "password" | "email">;
type QueryData = Pick<AppUser, "username">;

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3001"],
  })
);
app.use(
  session({
    secret: "my-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use("/", authRoutes);

// SERVER
app.listen(3000, () => {
  console.log(`🚀 Server started on http://localhost:3000`);
});


