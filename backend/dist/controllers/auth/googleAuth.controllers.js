"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGoogleSignUpFunction = handleGoogleSignUpFunction;
exports.handleGoogleSignUpCallbackFunction = handleGoogleSignUpCallbackFunction;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const checkAuthConstraints_1 = require("../../validchecks/checkAuthConstraints");
const mailer_1 = require("../../helpers/mailer");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND_DOMAIN}/user/signup-google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let googleEmail;
        let profileImageUrl;
        let randomPassword;
        let hashedPassword;
        if (profile && profile.emails) {
            googleEmail = profile.emails[0].value;
            randomPassword = (0, checkAuthConstraints_1.generateDummyPassword)(googleEmail);
            hashedPassword = await bcryptjs_1.default.hash(randomPassword, 10);
        }
        else {
            return done(new Error('No email found in Google profile'), undefined);
        }
        if (profile.photos && profile.photos.length > 0) {
            profileImageUrl = profile.photos[0].value;
        }
        else {
            profileImageUrl = undefined;
        }
        let user = await User_model_1.default.findOne({ email: googleEmail });
        const { nanoid } = await import('nanoid');
        if (!user) {
            user = new User_model_1.default({
                uniqueId: nanoid(),
                firstName: profile.name?.givenName || 'User',
                lastName: profile.name?.familyName || 'LastName',
                userName: profile.displayName.replace(/ /g, '_'),
                email: googleEmail,
                role: "STUDENT",
                password: hashedPassword,
                profileImageUrl: profileImageUrl,
                emailVerificationStatus: true
            });
            await user.save();
            await (0, mailer_1.sendGoogleAuthPasswordMail)(user.email, randomPassword);
        }
        done(null, user);
    }
    catch (error) {
        done(error, undefined);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_model_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
function handleGoogleSignUpFunction(req, res, next) {
    passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}
function handleGoogleSignUpCallbackFunction(req, res, next) {
    const FRONTEND_HOME_ROUTE = process.env.PUBLIC_FRONTEND_DOMAIN;
    const FRONTEND_SIGNUP_ROUTE = process.env.PUBLIC_FRONTEND_SIGNUP_ROUTE;
    passport_1.default.authenticate('google', {
        failureRedirect: FRONTEND_SIGNUP_ROUTE,
        successRedirect: FRONTEND_HOME_ROUTE,
    }, async (err, user, info) => {
        if (err || !user) {
            return res.redirect(FRONTEND_SIGNUP_ROUTE);
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            uniqueId: user.uniqueId,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: '15d' });
        res.redirect(`${FRONTEND_HOME_ROUTE}?success=true&message=Login successful&token=${token}`);
    })(req, res, next);
}
// const userData = {
//   userName: user.userName,
//   firstName: user.firstName,
//   lastName: user.lastName,
//   email: user.email,
//   emailVerificationStatus: user.emailVerificationStatus,
//   profileImageUrl: user.profileImageUrl
// };
// res.redirect(`${FRONTEND_HOME_ROUTE}?success=true&message=Login successful&token=${token}&email=${userData.email}&firstName=${userData.firstName}&userName=${userData.userName}&lastName=${userData.lastName}&emailVerificationStatus=${userData.emailVerificationStatus}&profileImageUrl=${userData.profileImageUrl}`);
