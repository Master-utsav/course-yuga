import express from "express";
import { 
    handleDeleteAccountFunction, 
    handleResendVerficationOTPFunction, 
    handleLoginFunction, 
    handleResetPasswordFunction, 
    handleResetPasswordVerificationOTP, 
    handleSignUpFunction, 
    handleUpdateUserFunction, 
    handleEmailVerificationOTP, 
} from "../controllers/user.controllers";

import { authenticateToken } from "../middleware/auth.middleware";
import { handleGoogleSignUpCallbackFunction, handleGoogleSignUpFunction } from "../controllers/googleAuth.controllers";
import { handleGithubSignUpCallbackFunction, handleGithubSignUpFunction } from "../controllers/githubAuth.controllers";

const userRoute = express.Router();

// User Signup/Login Routes
userRoute.post("/signup", handleSignUpFunction);
userRoute.post("/signup-google", handleGoogleSignUpFunction);
userRoute.post("/signup-google/callback", handleGoogleSignUpCallbackFunction);
userRoute.post("/signup-github", handleGithubSignUpFunction);
userRoute.post("/signup-github/callback", handleGithubSignUpCallbackFunction);
userRoute.post("/login", handleLoginFunction);

// Email Verification Routes
userRoute.post("/verify-email", handleResendVerficationOTPFunction);
userRoute.post("/verify-email-otp", handleEmailVerificationOTP);

// Password Reset Routes
userRoute.post("/reset-password", authenticateToken, handleResetPasswordFunction);
userRoute.post("/reset-password-otp", authenticateToken, handleResetPasswordVerificationOTP);

// User Update and Deletion Routes
userRoute.put("/update-user", authenticateToken, handleUpdateUserFunction);
userRoute.delete("/delete-account", authenticateToken, handleDeleteAccountFunction);

export default userRoute;
