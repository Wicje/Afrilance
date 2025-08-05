    
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { users } from '../models/user.model'; // adjust path based on your project structure
import { AppUser, RegisterData, QueryData } from "../types/auth.types";

export const register = async (
    req: Request<unknown, unknown, RegisterData>,
    res: Response
  ): Promise<any> => {
    const { username, email, password } = req.body;

    try {
      if (!username || !email || !password) {
        return res.status(422).json({ error: "Missing Credentials" });
      }

      if (await users.findOne({ email })) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await users.insert({
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
     };


export const login = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate(
    "local",
    (
      error: unknown,
      user: AppUser | false,
      info: { message?: string } | undefined
    ) => {
      if (error) {
        return res.status(500).json({ error: `Something went wrong` });
      }

      if (!user) {
        return res.status(401).json(info);
      }

      req.login(user, (error) => {
        if (error) {
          return res.status(500).json({ error: `Something went wrong` });
        }
        return res
          .status(200)
          .json({ id: user._id, username: user.username, email: user.email });
      });
    }
  )(req, res, next);
};

export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] }); // lines 104


export const googleAuthCallback = [
  passport.authenticate("google", { failureRedirect: "/login" }), // 
  async (req: Request, res: Response, next: NextFunction): void => { res.redirect("http://localhost:3001"); } // 
];


export const status = async (req: Request<QueryData>, res: Response): Promise<void> => {
    const username = req.params.username;
    const user = await users.findOne({ username });

    if (!user) {
      res.status(401).send({ msg: "User Not Found" });
      return;
    }
    res.status(200).send(user);
    return;
     };


export const me = async (
    req: Request<unknown, unknown, RegisterData>,
    res: Response
  ): Promise<any> => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Now you can use req.user directly without casting
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
     };


export const logout = async (req: Request, res: Response, next: NextFunction): void => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ error: `Something  went wrong` });
    }
    res.status(204).send();
  });
    };
