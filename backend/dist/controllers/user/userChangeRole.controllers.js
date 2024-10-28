"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChangeRoleRequestFunction = handleChangeRoleRequestFunction;
const User_model_1 = __importDefault(require("../../models/User.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function handleChangeRoleRequestFunction(req, res) {
    const userId = req.userId;
    const uniqueId = req.userUniqueId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!uniqueId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { newRole } = req.body;
    if (newRole !== "ADMIN") {
        return res.status(400).json({ success: false, message: "New role not provided" });
    }
    try {
        const user = await User_model_1.default.findById(userId);
        if (user.role === "ADMIN") {
            return res.status(400).json({ success: false, message: "user already a admin" });
        }
        user.role = newRole;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, uniqueId: user.uniqueId }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
        return res.status(200).json({ success: true, message: "You are now ADMIN", token });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
