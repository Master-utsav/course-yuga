"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateUserFunction = handleUpdateUserFunction;
const User_model_1 = __importDefault(require("../../models/User.model"));
async function handleUpdateUserFunction(req, res) {
    try {
        const userId = req.userId;
        const { firstName, lastName, userDob, address, bio } = req.body;
        if (!userId) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized: No user found" });
        }
        // Initialize updateData object with optional fields if they are not null or undefined
        const updateData = {};
        if (firstName != null)
            updateData.firstName = firstName;
        if (lastName != null)
            updateData.lastName = lastName;
        if (userDob != null)
            updateData.userDob = userDob;
        if (address != null)
            updateData.address = address;
        if (bio != null)
            updateData.bio = bio;
        // if (userName != null) updateData.userName = userName;
        // const isUser = await User.find({userName : userName});
        // if (isUser.length !== 0) {
        //   return res
        //     .status(404)
        //     .json({ success: false, message: "username already exists" });
        // }
        if (Object.keys(updateData).length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "No fields to update" });
        }
        const user = await User_model_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        await user.save();
        return res
            .status(200)
            .json({ success: true, message: "User updated successfully" });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}