"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.authenticateAdminToken = authenticateAdminToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        if (decoded && typeof decoded === 'object' && 'id' in decoded && 'uniqueId' in decoded) {
            req.userId = decoded.id;
            req.userUniqueId = decoded.uniqueId;
            next();
        }
        else {
            return res.status(403).json({ message: 'Invalid token' });
        }
    });
}
async function authenticateAdminToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (decoded &&
            typeof decoded === "object" &&
            "id" in decoded &&
            "role" in decoded &&
            "uniqueId" in decoded) {
            const { id, role, uniqueId } = decoded;
            if (role !== "ADMIN") {
                return res.status(403).json({ message: "Unauthorized: Admin access only" });
            }
            req.userId = id;
            req.userRole = role;
            req.userUniqueId = uniqueId;
            next();
        }
        else {
            return res.status(403).json({ message: "Invalid token" });
        }
    });
}
