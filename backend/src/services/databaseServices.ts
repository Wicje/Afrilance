import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
import { AppUser } from "../models/user.model";

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Export a clean abstraction around UserModel
export const users = {
  async findOne(query: Partial<AppUser>): Promise<AppUser | null> {
    return await UserModel.findOne(query).lean();
  },

  async insert(data: Omit<AppUser, "_id">): Promise<AppUser> {
    const user = new UserModel(data);
    await user.save();
    return user.toObject();
  },

  // Optional: Add update, delete, list, etc.
};

export { AppUser };

