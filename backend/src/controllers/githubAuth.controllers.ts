// githubAuth.controller.ts
import { Request, Response } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import { generateDummyPassword } from "../validchecks/checkAuthConstraints";
import { sendGithubAuthPasswordMail } from "../helpers/mailer";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:8001/api/user/signup-github/callback",
    },
    async (accessToken: any, refreshToken: any, profile: { emails: { value: string; }[]; displayName: any; username: any; }, done: (arg0: Error | null, arg1: undefined) => void) => {
      try {
        let githubEmail: string;
        let randomPassword: string;

        // Get email from profile
        if (profile && profile.emails) {
          githubEmail = profile.emails[0].value;
          randomPassword = generateDummyPassword(githubEmail);
        } else {
          return done(new Error("No email found in GitHub profile"), undefined);
        }

        if (!randomPassword) {
          return done(new Error("Error generating random password"), undefined);
        }

        let user = await User.findOne({ email: githubEmail });

        if (!user) {

          const nameParts = (profile.displayName || "User").split(" ");
          const firstName = nameParts[0] || "User";
          const lastName = nameParts.slice(1).join(" ") || "User";

          user = new User({
            firstName: firstName,
            lastName: lastName,
            userName: profile.username,
            email: githubEmail,
            password: randomPassword,
            emailVerificationStatus: true,
          });
          await user.save();
          await sendGithubAuthPasswordMail(user.email, randomPassword);
        }

        done(null, user);
      } catch (error) {
        done(
          new Error("Something went wrong during GitHub authentication"),
          undefined
        );
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


export function handleGithubSignUpFunction(req: Request, res: Response, next: Function) {
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
}

export function handleGithubSignUpCallbackFunction(req: Request, res: Response, next: Function) {
  passport.authenticate("github", { failureRedirect: "/login" }, (err: any, user: { _id: any; userName: any; email: any; firstName: any;
    lastName: any; emailVerificationStatus: any; }, info: any) => {
    if (err || !user) {
      return res.redirect("/login");
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerificationStatus: user.emailVerificationStatus,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  })(req, res, next);
}
