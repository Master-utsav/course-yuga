// githubAuth.controller.ts
import { Request, Response } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import { generateDummyPassword } from "../validchecks/checkAuthConstraints";
import { sendGithubAuthPasswordMail } from "../helpers/mailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:8001/api/user/signup-github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: { emails: { value: string }[]; displayName: string; username: string; photos: { value: string }[] },
      done: (error: Error | null, user?: any) => void
    ) => {
      try {
        let githubEmail: string | undefined;
        let randomPassword: string;
        let hashedPassword: string;
        let profileImageUrl: string | undefined;

        if (profile?.emails?.length) {
          githubEmail = profile.emails[0].value;
        } else {
          const response = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "User-Agent": "Course-Yuga",
            },
          });

          const emails = await response.json();

          const primaryEmail = emails.find((email: any) => email.primary) || emails[0];
          githubEmail = primaryEmail ? primaryEmail.email : undefined;

          if (!githubEmail) {
            return done(new Error("No email found in GitHub profile or via API"), undefined);
          }
        }

        randomPassword = generateDummyPassword(githubEmail);
        hashedPassword = await bcrypt.hash(randomPassword, 10);

        if (!randomPassword) {
          return done(new Error("Error generating random password"), undefined);
        }

        if (profile?.photos?.length > 0) {
          profileImageUrl = profile.photos[0].value;
        }

        let user = await User.findOne({ email: githubEmail });

        if (!user) {
          const nameParts = (profile.displayName || "User").split(" ");
          const firstName = nameParts[0] || "User";
          const lastName = nameParts.slice(1).join(" ") || "User";

          user = new User({
            firstName,
            lastName,
            userName: profile.username.replace(/ /g, "_"),
            email: githubEmail,
            password: hashedPassword,
            profileImageUrl,
            emailVerificationStatus: true,
            role: "STUDENT",
          });

          await user.save();
          await sendGithubAuthPasswordMail(user.email, randomPassword);
        }

        return done(null, user);
      } catch (error) {
        return done(new Error("Something went wrong during GitHub authentication"), undefined);
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
  const FRONTEND_HOME_ROUTE = process.env.PUBLIC_FRONTEND_DOMAIN!;
  passport.authenticate(
    "github",
    { failureRedirect: FRONTEND_HOME_ROUTE},
    (err: any, user: any, info: any) => {
      if (err || !user) {
        return res.redirect(FRONTEND_HOME_ROUTE);
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "15d" }
      );

      const userData = {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        emailVerificationStatus: user.emailVerificationStatus,
      };

      res.redirect(`${FRONTEND_HOME_ROUTE}?success=true&message=Login successful&token=${token}&email=${userData.email}&firstName=${userData.firstName}&userName=${userData.userName}&lastName=${userData.lastName}&emailVerificationStatus=${userData.emailVerificationStatus}&profileImageUrl=${userData.profileImageUrl}`);
    }
  )(req, res, next);
}

