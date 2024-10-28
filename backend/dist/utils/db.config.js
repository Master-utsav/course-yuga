"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    try {
        const connect = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}
