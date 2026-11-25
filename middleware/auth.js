import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

        if (!token) {
            return res.status(401).json({message: "Authentication required."});
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.sub || payload.id;

        if (!userId) {
            return res.status(401).json({message: "Invalid authentication token."});
        }

        const user = await User.findById(userId).select("-passwordHash");
        if (!user) {
            return res.status(401).json({message: "User no longer exists."});
        }

        req.user = user;
        req.auth = payload;
        return next();
    } catch (error) {
        return res.status(401).json({
            message: error?.name === "TokenExpiredError"
                ? "Your session has expired. Please sign in again."
                : "Invalid authentication token."
        });
    }
}

export function requireAdmin(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({message: "Admin access required."});
    }
    return next();
}
