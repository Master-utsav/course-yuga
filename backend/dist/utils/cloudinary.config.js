"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedVideoUrl = void 0;
exports.getPublicIdFromPath = getPublicIdFromPath;
exports.cloudinaryUploadUserImageFiles = cloudinaryUploadUserImageFiles;
exports.cloudinaryUploadCourseImageFiles = cloudinaryUploadCourseImageFiles;
exports.cloudinaryUploadVideoImageFiles = cloudinaryUploadVideoImageFiles;
exports.cloudinaryUploadVideoFiles = cloudinaryUploadVideoFiles;
exports.cloudinaryDeleteUserImage = cloudinaryDeleteUserImage;
exports.cloudinaryDeleteCourseImage = cloudinaryDeleteCourseImage;
exports.cloudinaryDeleteVideoImage = cloudinaryDeleteVideoImage;
exports.cloudinaryDeleteVideoFile = cloudinaryDeleteVideoFile;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
function getPublicIdFromPath(cloudinaryPath) {
    const parts = cloudinaryPath.split('/');
    return parts[parts.length - 1]; // Returns the last part as public ID
}
const getSignedVideoUrl = (publicId) => {
    return cloudinary_1.v2.url(publicId, {
        resource_type: "video",
        type: "upload",
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 15, // 15 mins expiry
    });
};
exports.getSignedVideoUrl = getSignedVideoUrl;
async function cloudinaryUploadUserImageFiles(localFilePath) {
    if (!localFilePath) {
        return null;
    }
    else {
        try {
            const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder: "userImages",
            });
            return {
                url: response.secure_url,
                public_id: response.public_id,
            };
        }
        catch (error) {
            return null;
        }
    }
}
async function cloudinaryUploadCourseImageFiles(localFilePath) {
    if (!localFilePath) {
        return null;
    }
    else {
        try {
            const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder: "courseImages",
            });
            return {
                url: response.secure_url,
                public_id: response.public_id,
            };
        }
        catch (error) {
            return null;
        }
    }
}
async function cloudinaryUploadVideoImageFiles(localFilePath) {
    if (!localFilePath) {
        return null;
    }
    else {
        try {
            const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder: "videoImages",
            });
            return {
                url: response.secure_url,
                public_id: response.public_id,
            };
        }
        catch (error) {
            return null;
        }
    }
}
async function cloudinaryUploadVideoFiles(localFilePath) {
    if (!localFilePath) {
        return null;
    }
    else {
        try {
            const response = await cloudinary_1.v2.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder: "VideoFiles",
            });
            return {
                url: response.secure_url,
                public_id: response.public_id,
            };
        }
        catch (error) {
            return null;
        }
    }
}
async function cloudinaryDeleteUserImage(ImageUrl) {
    if (!ImageUrl) {
        return null;
    }
    const publicId = `userImages/${extractPublicIdFromUrl(ImageUrl)}`;
    if (!publicId) {
        return null;
    }
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        return result;
    }
    catch (error) {
        console.error("Error deleting user image:", error);
        return null;
    }
}
async function cloudinaryDeleteCourseImage(ImageUrl) {
    if (!ImageUrl) {
        return null;
    }
    const publicId = `courseImages/${extractPublicIdFromUrl(ImageUrl)}`;
    if (!publicId) {
        return null;
    }
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        return result;
    }
    catch (error) {
        console.error("Error deleting course image:", error);
        return null;
    }
}
async function cloudinaryDeleteVideoImage(ImageUrl) {
    if (!ImageUrl) {
        return null;
    }
    const publicId = `videoImages/${extractPublicIdFromUrl(ImageUrl)}`;
    if (!publicId) {
        return null;
    }
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        return result;
    }
    catch (error) {
        console.error("Error deleting course image:", error);
        return null;
    }
}
async function cloudinaryDeleteVideoFile(VideoUrl) {
    if (!VideoUrl) {
        return null;
    }
    const publicId = `VideoFiles/${extractPublicIdFromUrl(VideoUrl)}`;
    if (!publicId) {
        return null;
    }
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "video",
        });
        return result;
    }
    catch (error) {
        console.error("Error deleting course video:", error);
        return null;
    }
}
function extractPublicIdFromUrl(url) {
    const regex = /\/([^\/]+)\.(jpg|jpeg|png|gif|webp|tiff|bmp)$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
