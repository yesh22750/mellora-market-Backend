import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import adminRoutes from "./routes/admin.js";
import cartRoutes from "./routes/cart.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        logger.warn("CORS origin rejected", {origin});
        return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
}));

app.use(express.json({limit: "1mb"}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false
}));

app.use((req, _res, next) => {
    logger.info("HTTP REQUEST", {
        method: req.method,
        path: req.originalUrl
    });
    next();
});

app.get("/api", (_req, res) => {
    res.json({
        status: "ok",
        service: "Mellora Market API",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.get("/api/health", (_req, res) => {
    res.json({
        status: "healthy",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => {
    res.status(404).json({message: "Route not found."});
});

app.use((error, _req, res, _next) => {
    logger.error("SERVER ERROR", {
        message: error.message,
        stack: error.stack
    });

    if (error.message === "CORS origin not allowed") {
        return res.status(403).json({message: error.message});
    }

    return res.status(500).json({message: "Internal server error."});
});

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            throw new Error("JWT_SECRET must be at least 32 characters long.");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        logger.info("MongoDB connected");

        const server = app.listen(PORT, () => {
            logger.info(`Mellora Market API listening on http://localhost:${PORT}`);
        });

        const shutdown = async signal => {
            logger.info(`${signal} received. Shutting down Mellora Market API.`);
            server.close(async () => {
                await mongoose.connection.close();
                process.exit(0);
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    } catch (error) {
        logger.error("Startup failed", {message: error.message});
        process.exit(1);
    }
}

startServer();

export default app;
