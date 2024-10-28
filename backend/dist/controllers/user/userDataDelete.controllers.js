"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteAccountFunction = handleDeleteAccountFunction;
const User_model_1 = __importDefault(require("../../models/User.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_config_1 = require("../../utils/cloudinary.config");
async function handleDeleteAccountFunction(req, res) {
    const userId = req.userId;
    const { password } = req.body;
    if (!userId) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized: No user found" });
    }
    try {
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid password" });
        }
        if (user.profileImageUrl) {
            await (0, cloudinary_config_1.cloudinaryDeleteUserImage)(user.profileImageUrl);
        }
        const deletedUser = await User_model_1.default.deleteOne({ email: user.email });
        if (!deletedUser) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        return res
            .status(200)
            .json({ success: true, message: "Account deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting account:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}
