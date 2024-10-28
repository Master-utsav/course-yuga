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
exports.VideoType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var VideoType;
(function (VideoType) {
    VideoType["PERSONAL"] = "PERSONAL";
    VideoType["YOUTUBE"] = "YOUTUBE";
})(VideoType || (exports.VideoType = VideoType = {}));
// Define the Video schema
const videoSchema = new mongoose_1.Schema({
    videoId: { type: String, required: true, unique: true },
    videoName: { type: String, required: true, trim: true },
    tutorName: { type: String, required: true, trim: true },
    videoType: {
        type: String,
        enum: Object.values(VideoType),
        required: true,
    },
    courseId: { type: String, ref: "Course", required: true },
    uploadedBy: { type: String, ref: "User", required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, trim: true },
    watchedBy: [{ type: String, ref: "User" }],
    videoTimeStamps: [
        {
            time: { type: String, required: true },
            text: { type: String, required: true, trim: true },
        },
    ],
    isVerified: { type: Boolean, default: false },
    markdownContent: { type: String },
    pub_id: { type: String }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
videoSchema.virtual("watchCount").get(function () {
    return this.watchedBy?.length ?? 0;
});
const VideoModel = mongoose_1.default.models.Video || (0, mongoose_1.model)("Video", videoSchema);
exports.default = VideoModel;
