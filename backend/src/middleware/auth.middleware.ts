import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

export interface AuthenticatedRequest extends Request {
    userId?: string;
    userUniqueId?: string;
}

export interface AuthenticatedAdminRequest extends Request {
  userId?: string;
  userRole?: string;
  userUniqueId?: string;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];  
  
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        if (decoded && typeof decoded === 'object' && 'id' in decoded && 'uniqueId' in decoded) {
            req.userId = (decoded as { id: string }).id;
            req.userUniqueId = (decoded as { uniqueId: string }).uniqueId;
            next();
        } else {
            return res.status(403).json({ message: 'Invalid token' });
        }
    });
}

export async function authenticateAdminToken(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    if (
      decoded &&
      typeof decoded === "object" &&
      "id" in decoded &&
      "role" in decoded &&
      "uniqueId" in decoded
    ) {
      const { id, role , uniqueId } = decoded as { id: string; role: string , uniqueId: string};

      if (role !== "ADMIN" && role !== "MASTER") {
        return res.status(403).json({ message: "Unauthorized: Admin access only" });
      }

      req.userId = id;
      req.userRole = role;
      req.userUniqueId = uniqueId;
      next();
    } else {
      return res.status(403).json({ message: "Invalid token" });
    }
  });
}

