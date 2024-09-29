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
    let googleEmail: string;
    let randomPassword: string;
    
    if (profile && profile.emails) {
      googleEmail = profile.emails[0].value;
      randomPassword = generateDummyPassword(googleEmail);
    } else {
      return done(new Error('No email found in Google profile'), undefined);
    }

    if (!randomPassword) {
      return done(new Error('Error generating random password'), undefined);
    }

    let user = await User.findOne({ email: googleEmail });

    if (!user) {
      user = new User({
        firstName: profile.name?.givenName || 'User',
        lastName: profile.name?.familyName || 'LastName',  
        userName: profile.displayName,
        email: googleEmail,
        password: randomPassword,
        emailVerificationStatus: true
      });
      await user.save();
      await sendGoogleAuthPasswordMail(user.email, randomPassword);
    }

    done(null, user);
  } catch (error) {
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
    done(error, null);
  }
});

export function handleGoogleSignUpFunction(req: Request, res: Response, next: Function) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

export function handleGoogleSignUpCallbackFunction(req: Request, res: Response, next: Function) {
  passport.authenticate('google', { failureRedirect: '/login' }, async (err, user, info) => {
    if (err || !user) {
      return res.redirect('/login');
    }

    const token = jwt.sign({
      id: user._id,
      role : user.role,
    }, process.env.JWT_SECRET!, { expiresIn: '15d' });

    const userData = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerificationStatus: user.emailVerificationStatus
  }

    // Send the token to the client
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userData
    });
  })(req, res, next);
}
