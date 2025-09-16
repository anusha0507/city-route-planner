import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function authMiddleware(req, res, next) {
  try {
    // Check both lowercase and uppercase Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header provided" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optional: Validate user still exists in database
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach full user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      username: admin.username
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    
    return res.status(401).json({ error: "Token validation failed" });
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied: admin only" });
  }
  next();
}

export function superAdminOnly(req, res, next) {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied: superadmin only" });
  }
  next();
}