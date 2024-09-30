// googleAuth.controller.ts
import { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { generateDummyPassword } from '../validchecks/checkAuthConstraints';
import { sendGoogleAuthPasswordMail } from '../helpers/mailer';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:8001/api/user/signup-google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("Google OAuth Profile received:", profile); // Log the profile for debugging

    // Extract user details from Google profile
    let googleEmail: string;
    let randomPassword: string;
    let profileImageUrl: string | undefined;
    
    if (profile && profile.emails) {
      googleEmail = profile.emails[0].value;
      randomPassword = generateDummyPassword(googleEmail);
    } else {
      return done(new Error('No email found in Google profile'), undefined);
    }

    if (profile.photos && profile.photos.length > 0) {
      profileImageUrl = profile.photos[0].value; 
    } else {
      profileImageUrl = undefined; 
    }
    
    // Check if user already exists
    let user = await User.findOne({ email: googleEmail });
    
    if (!user) {
      // Create a new user
      user = new User({
        firstName: profile.name?.givenName || 'User',
        lastName: profile.name?.familyName || 'LastName',
        userName: profile.displayName.replace(/ /g, '_'),
        email: googleEmail,
        role: "STUDENT",
        password: randomPassword,
        profileImageUrl: profileImageUrl,  // Store the profile image URL
        emailVerificationStatus: true
      });
      await user.save();  // Save the new user in the database
      console.log("New user created:", user);

      // Send email with generated password
      await sendGoogleAuthPasswordMail(user.email, randomPassword);
    } else {
      console.log("User already exists:", user);
    }

    done(null, user);  // Complete the authentication
  } catch (error) {
    console.error("Error during Google OAuth authentication:", error);
    done(error, undefined);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, null);
  }
});

export function handleGoogleSignUpFunction(req: Request, res: Response, next: Function) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

export function handleGoogleSignUpCallbackFunction(req: Request, res: Response, next: Function) {
  
const FRONTEND_HOME_ROUTE = process.env.PUBLIC_FRONTEND_DOMAIN!;
  passport.authenticate('google', { failureRedirect: FRONTEND_HOME_ROUTE }, async (err, user, info) => {
    if (err || !user) {
      console.error("Google OAuth Error or User not found:", err);
      return res.redirect(FRONTEND_HOME_ROUTE);
    }

    console.log("User authenticated:", user);

    // Generate JWT token
    const token = jwt.sign({
      id: user._id,
      role: user.role,
    }, process.env.JWT_SECRET!, { expiresIn: '15d' });

    const userData = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerificationStatus: user.emailVerificationStatus,
      profileImageUrl: user.profileImageUrl
    };

    // Send the token and user data to the client
    res.redirect(`${FRONTEND_HOME_ROUTE}?success=true&message=Login successful&token=${token}&email=${userData.email}&firstName=${userData.firstName}&userName=${userData.userName}&lastName=${userData.lastName}&emailVerificationStatus=${userData.emailVerificationStatus}&profileImageUrl=${userData.profileImageUrl}`);
    // return res.status(200).json({
    //   success: true,
    //   message: "Login successful",
    //   token,
    //   userData,
    //   user
    // });
  })(req, res, next);
}
