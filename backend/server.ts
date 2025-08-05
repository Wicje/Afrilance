import express, { Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes";
import { users } from "./src/services/databaseServices";
import "./src/services/passport";
import { ensureAuthentication } from "../src/middlewares/auth.Middleware";
import { AppUser, RegisterData, QueryData } from "./src/types/auth.types";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
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
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Set Proxy
app.set("trust proxy", 1);

// ROUTES
app.use("/", authRoutes);

// SERVER
app.listen(3000, () => {
  console.log(`🚀 Server started on http://localhost:3000`);
});


