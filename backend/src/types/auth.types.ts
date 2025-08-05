export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AppUser {
  _id?: string; // make optional for Mongo insert
  username: string;
  email: string;
  password?: string; // optional if using Google
  googleId?: string;
}

export interface QueryData {
  username: string;
}

