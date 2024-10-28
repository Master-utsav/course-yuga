"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_middleware_1 = require("../middleware/multer.middleware");
const googleAuth_controllers_1 = require("../controllers/auth/googleAuth.controllers");
const githubAuth_controllers_1 = require("../controllers/auth/githubAuth.controllers");
const localAuth_controllers_1 = require("../controllers/auth/localAuth.controllers");
const userContactUpdate_controllers_1 = require("../controllers/user/userContactUpdate.controllers");
const userDataDelete_controllers_1 = require("../controllers/user/userDataDelete.controllers");
const userDataUpdate_controllers_1 = require("../controllers/user/userDataUpdate.controllers");
const userEmailVerification_controllers_1 = require("../controllers/user/userEmailVerification.controllers");
const userGetData_controllers_1 = require("../controllers/user/userGetData.controllers");
const userProfileUpdate_controllers_1 = require("../controllers/user/userProfileUpdate.controllers");
const userResetPassword_controllers_1 = require("../controllers/user/userResetPassword.controllers");
const userCourseHandlers_controllers_1 = require("../controllers/user/userCourseHandlers.controllers");
const userChangeRole_controllers_1 = require("../controllers/user/userChangeRole.controllers");
const userRoute = express_1.default.Router();
// User Data Get
userRoute.get("/get-user", auth_middleware_1.authenticateToken, userGetData_controllers_1.handleGetUserDataFunction);
// User Bookmarked Videos
userRoute.post("/get-bookmarked-videos", auth_middleware_1.authenticateToken, userGetData_controllers_1.handleGetUsersBookmarkedVideo);
userRoute.post("/get-bookmarked-courses", auth_middleware_1.authenticateToken, userGetData_controllers_1.handleGetUsersBookmarkedCourses);
// userRoute.post("/get-bookmarked-tests", authenticateToken , handleGetUsersBookmarkedTests);
// User Signup/Login Routes
userRoute.post("/signup", localAuth_controllers_1.handleSignUpFunction);
userRoute.get("/signup-google", googleAuth_controllers_1.handleGoogleSignUpFunction);
userRoute.get("/signup-google/callback", googleAuth_controllers_1.handleGoogleSignUpCallbackFunction);
userRoute.get("/signup-github", githubAuth_controllers_1.handleGithubSignUpFunction);
userRoute.get("/signup-github/callback", githubAuth_controllers_1.handleGithubSignUpCallbackFunction);
userRoute.post("/login", localAuth_controllers_1.handleLoginFunction);
// Email Verification Routes
userRoute.post("/verify-email", userEmailVerification_controllers_1.handleResendVerficationOTPFunction);
userRoute.post("/verify-email-otp", userEmailVerification_controllers_1.handleEmailVerificationOTP);
// Mobile Number Verification Routes
userRoute.post("/verify-mobile-number-otp-check", auth_middleware_1.authenticateToken, userContactUpdate_controllers_1.handlePhoneNumberOTPCheckFunction);
userRoute.post("/verify-mobile-number-send-otp", auth_middleware_1.authenticateToken, userContactUpdate_controllers_1.handlePhoneNumberOTPSendFunction);
// Password Reset Routes
userRoute.post("/reset-password", userResetPassword_controllers_1.handleResetPasswordFunction);
userRoute.post("/reset-password-otp", userResetPassword_controllers_1.handleResetPasswordVerificationOTP);
// User Update Image or Upload Image
userRoute.post("/update-user-image", auth_middleware_1.authenticateToken, multer_middleware_1.upload.single("image"), userProfileUpdate_controllers_1.handleUpdateUserImageFunction);
// User Update and Deletion Routes
userRoute.put("/update-user", auth_middleware_1.authenticateToken, userDataUpdate_controllers_1.handleUpdateUserFunction);
userRoute.put("/update-role", auth_middleware_1.authenticateToken, userChangeRole_controllers_1.handleChangeRoleRequestFunction);
userRoute.post("/delete-account", auth_middleware_1.authenticateToken, userDataDelete_controllers_1.handleDeleteAccountFunction);
//User added bookmarks to the course
userRoute.post("/user-course-bookmarks", auth_middleware_1.authenticateToken, userCourseHandlers_controllers_1.handleUserCourseBookmarkfunction);
userRoute.post("/user-video-bookmarks", auth_middleware_1.authenticateToken, userCourseHandlers_controllers_1.handleUserVideoBookmarkfunction);
//User added completed Video 
userRoute.post("/user-video-progress", auth_middleware_1.authenticateToken, userCourseHandlers_controllers_1.handleUserCourseProgress);
exports.default = userRoute;
