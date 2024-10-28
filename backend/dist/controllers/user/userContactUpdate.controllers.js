"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePhoneNumberOTPCheckFunction = handlePhoneNumberOTPCheckFunction;
exports.handlePhoneNumberOTPSendFunction = handlePhoneNumberOTPSendFunction;
const twilio_1 = __importDefault(require("twilio"));
const User_model_1 = __importDefault(require("../../models/User.model"));
async function handlePhoneNumberOTPCheckFunction(req, res) {
    const userId = req.userId;
    const { to, code, countryCode } = req.body;
    const user = await User_model_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    if (!to || !code || !countryCode) {
        return res.status(400).json({
            success: false,
            message: "Missing required parameters: to, code , countryCode",
        });
    }
    function removeCountryCode(phoneNumber, countryCode) {
        if (phoneNumber.startsWith(countryCode)) {
            return phoneNumber.slice(countryCode.length);
        }
        return phoneNumber;
    }
    const number = removeCountryCode(to, countryCode);
    try {
        const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;
        const check = await client.verify.v2
            .services(VERIFY_SERVICE_SID)
            .verificationChecks.create({ to, code });
        if (check.status === "approved") {
            await User_model_1.default.findByIdAndUpdate(userId, {
                $set: {
                    phoneNumberVerificationStatus: true,
                    "phoneNumber.number": number,
                    "phoneNumber.code": countryCode,
                },
            });
            return res.status(200).json({
                success: true,
                message: "Verification successful.",
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP.",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
async function handlePhoneNumberOTPSendFunction(req, res) {
    const userId = req.userId;
    const { to, channel = "sms", locale = "en" } = req.body;
    if (!to || to.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Missing 'to' parameter; please provide a phone number or email.",
        });
    }
    const user = await User_model_1.default.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    const userNumber = user.phoneNumber.number + user.phoneNumber.code;
    if (userNumber !== undefined && userNumber === to) {
        return res
            .status(404)
            .json({ success: false, message: "Phone number is already verified" });
    }
    const isUser = await User_model_1.default.findOne({
        $expr: {
            $eq: [
                { $concat: ["$phoneNumber.code", "$phoneNumber.number"] },
                to
            ]
        }
    });
    if (isUser) {
        return res.status(400).json({ success: false, message: "number already exists" });
    }
    try {
        const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;
        await client.verify.v2.services(VERIFY_SERVICE_SID).verifications.create({
            to,
            channel,
            locale,
        });
        return res
            .status(200)
            .json({ success: true, message: `OTP sent to ${to}` });
    }
    catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    }
}
