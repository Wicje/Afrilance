
// src/types/express.d.ts
import { AppUser } from "./auth.types";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
