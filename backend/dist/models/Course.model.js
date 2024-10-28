"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var CourseType;
(function (CourseType) {
    CourseType["PERSONAL"] = "PERSONAL";
    CourseType["REDIRECT"] = "REDIRECT";
    CourseType["YOUTUBE"] = "YOUTUBE";
})(CourseType || (exports.CourseType = CourseType = {}));
const ratingSchema = new mongoose_1.Schema({
    by: { type: String, ref: "User", required: true },
    rate: { type: Number, required: true, min: 0, max: 5 },
}, { _id: false });
const courseSchema = new mongoose_1.Schema({
    courseName: { type: String, required: true, trim: true },
    tutorName: { type: String, required: true, trim: true },
    courseType: {
        type: String,
        enum: Object.values(CourseType),
        required: true,
    },
    description: { type: String, required: true, trim: true },
    courseId: { type: String, required: true, unique: true },
    currency: { type: String, required: true, trim: true },
    sellingPrice: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    ratings: [ratingSchema],
    uploadedBy: { type: String, ref: "User", required: true },
    likedBy: [{ type: String, ref: "User" }],
    markdownContent: { type: String },
    redirectLink: { type: String, trim: true },
    enrolledBy: [{ type: String, ref: "User" }],
    videos: [{ type: String, ref: "Video" }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
courseSchema.virtual("ratingCount").get(function () {
    return this.ratings?.length ?? 0;
});
courseSchema.virtual("rating").get(function () {
    if (!this.ratings || this.ratings.length === 0)
        return 0;
    const total = this.ratings.reduce((sum, rating) => sum + rating.rate, 0);
    return Number((total / this.ratings.length).toFixed(2));
});
courseSchema.virtual("likedCount").get(function () {
    return this.likedBy?.length ?? 0;
});
courseSchema.virtual("enrolledCount").get(function () {
    return this.enrolledBy?.length ?? 0;
});
const CourseModel = mongoose_1.default.models.Course || (0, mongoose_1.model)("Course", courseSchema);
exports.default = CourseModel;
