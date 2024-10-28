"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    uniqueId: { type: String, required: true, unique: true },
    firstName: { type: String, required: [true, "Firstname is required"] },
    lastName: { type: String, required: [true, "LastName is required"] },
    userName: { type: String, required: [true, "Username is required"] },
    password: { type: String, required: [true, "Password is required"] },
    email: { type: String, required: [true, "Email is required"] },
    profileImageUrl: { type: String || undefined },
    role: { type: String, enum: ["ADMIN", "STUDENT"], required: true },
    emailVerificationOTP: { type: String },
    emailVerificationOTPExpires: { type: String },
    emailVerificationStatus: { type: Boolean, default: false },
    emailSendTime: { type: String },
    passwordResetOTP: { type: String },
    passwordResetOTPExpires: { type: String },
    passwordSendTime: { type: String },
    phoneNumber: {
        code: { type: String },
        number: { type: String }
    },
    phoneNumberVerificationStatus: { type: Boolean, default: false },
    userDob: { type: String },
    bio: { type: String, default: "Hey, I am using LMS", max: [500, "bio must be within the 500 chars"] },
    address: {
        country: { type: String },
        city: { type: String },
        state: { type: String }
    },
    uploadedCourses: [{ type: String, ref: "Course" }],
    enrolledIn: [{ type: String, ref: "Course" }],
    bookmarks: {
        course: [{ type: String, ref: "Course" }],
        video: [{ type: String, ref: "Video" }],
        test: [{ type: String, ref: "Test" }],
    },
    progress: [
        {
            courseId: { type: String, ref: 'Course' },
            completedVideos: [{ type: String, ref: 'Video' }],
            count: { type: Number }
        },
    ],
}, {
    timestamps: true
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
