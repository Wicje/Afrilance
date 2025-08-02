
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { users, AppUser } from "./databaseServices";
import bcrypt from "bcrypt";

// ====== LOCAL STRATEGY ======
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // or "username" if you're using usernames
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await users.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Invalid password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ====== GOOGLE STRATEGY ======
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(null, false);

        let user = await users.findOne({ email });

        if (!user) {
          // Auto-register new user
          user = await users.insert({
            username: profile.displayName,
            email,
            password: "", // no password for Google users
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ====== SERIALIZE/DESERIALIZE ======
passport.serializeUser((user: AppUser, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await users.findOne({ _id: id });
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});




/*
 
let user = await users.findOne({ email });

if (!user) {
  user = await users.insert({
    username: profile.displayName,
    email,
    password: "",
    googleId: profile.id,
  });
} else {
  // ✅ Update googleId if it wasn’t stored before
  if (!user.googleId) {
    await users.update({ _id: user._id }, { $set: { googleId: profile.id } });
  }
}
*/
