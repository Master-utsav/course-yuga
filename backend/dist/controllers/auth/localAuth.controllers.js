"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignUpFunction = handleSignUpFunction;
exports.handleLoginFunction = handleLoginFunction;
const User_model_1 = __importDefault(require("../../models/User.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const checkAuthConstraints_1 = require("../../validchecks/checkAuthConstraints");
const mailer_1 = require("../../helpers/mailer");
async function handleSignUpFunction(req, res) {
    try {
        const { userName, firstName, lastName, email, password } = req.body;
        if (!userName || !firstName || !email || !password || !lastName) {
            return res
                .status(400)
                .json({ success: false, message: "Please filled all the fields" });
        }
        const isValid = (0, checkAuthConstraints_1.checkConstraints)(userName, firstName, lastName, email, password);
        if (!isValid) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Constraints" });
        }
        const user = await User_model_1.default.findOne({ email: email });
        if (user && user.email === email && !user.emailVerificationStatus) {
            await (0, mailer_1.emailVerificationAlert)(user.email);
        }
        if (user && user.emailVerificationStatus === true) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }
        const username = await User_model_1.default.findOne({ userName: userName });
        if (username && username.emailVerificationStatus) {
            return res
                .status(400)
                .json({ success: false, message: "User Name already taken" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const { nanoid } = await import('nanoid');
        const newUser = new User_model_1.default({
            uniqueId: nanoid(),
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: "STUDENT",
        });
        const userId = newUser._id;
        await newUser.save();
        await (0, mailer_1.sendEmailVerification)(email, userId);
        return res.status(201).json({
            success: true,
            message: "signed up successfully, please verify your email",
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}
async function handleLoginFunction(req, res) {
    try {
        const { identity, password } = req.body;
        if (!identity || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Please fill all the fields" });
        }
        let userIdentity = null;
        const returnedIdentity = (0, checkAuthConstraints_1.returnIdentity)(identity);
        if (returnedIdentity === "userName") {
            const isValidConstraintsAsUserName = (0, checkAuthConstraints_1.checkLoginConstraintsAsUserName)(identity, password);
            if (!isValidConstraintsAsUserName) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid username or password" });
            }
            userIdentity = identity;
        }
        else if (returnedIdentity === "email") {
            const isValidConstraintsAsEmail = (0, checkAuthConstraints_1.checkLoginConstraintsAsEmail)(identity, password);
            if (!isValidConstraintsAsEmail) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid email or password" });
            }
            userIdentity = identity;
        }
        const user = await User_model_1.default.findOne({
            $or: [{ userName: userIdentity }, { email: userIdentity }],
        });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Incorrect password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, uniqueId: user.uniqueId }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
        return res
            .status(200)
            .json({ success: true, message: "Login successful", token });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}
