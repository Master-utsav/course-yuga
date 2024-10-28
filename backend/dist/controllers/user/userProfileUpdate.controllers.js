"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateUserImageFunction = handleUpdateUserImageFunction;
const User_model_1 = __importDefault(require("../../models/User.model"));
const cloudinary_config_1 = require("../../utils/cloudinary.config");
const fs_1 = __importDefault(require("fs"));
async function handleUpdateUserImageFunction(req, res) {
    try {
        const userId = req.userId;
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded." });
        }
        if (user.profileImageUrl) {
            await (0, cloudinary_config_1.cloudinaryDeleteUserImage)(user.profileImageUrl);
        }
        const localFilePath = req.file.path;
        const uploadResult = await (0, cloudinary_config_1.cloudinaryUploadUserImageFiles)(localFilePath);
        if (!uploadResult) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
        }
        fs_1.default.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            }
        });
        const updatedUser = await User_model_1.default.findByIdAndUpdate(userId, {
            $set: {
                profileImageUrl: uploadResult.url
            }
        });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        await updatedUser.save();
        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully.",
        });
    }
    catch (error) {
        console.error("Error updating user image:", error);
        return res.status(500).json({ success: false, message: "An error occurred while uploading the image." });
    }
}
