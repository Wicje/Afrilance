
import mongoose from "mongoose";

export interface AppUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  googleId?: string;
}

// Mongoose schema config
const userSchema = new mongoose.Schema<AppUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for Google OAuth
    googleId: { type: String }, // optional
  },
  { timestamps: true }
);

// Create and export the model
export const UserModel = mongoose.model<AppUser & mongoose.Document>(
  "User",
  userSchema
);
