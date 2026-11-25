import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {randomUUID} from "node:crypto";
import User from "../models/User.js";
import {requireAuth} from "../middleware/auth.js";
import logger from "../utils/logger.js";

const router = express.Router();

function publicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
    };
}

function sign(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            sub: user._id.toString(),
            role: user.role,
            jti: randomUUID()
        },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
}

function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function validPassword(password) {
    return typeof password === "string" && password.length >= 6 && password.length <= 128;
}

router.post("/register", async (req, res) => {
    try {
        const name = String(req.body?.name || "").trim();
        const email = normalizeEmail(req.body?.email);
        const password = req.body?.password;

        if (name.length < 2 || name.length > 80 || !email || !validPassword(password)) {
            return res.status(400).json({
                message: "Enter a valid name, email and a 6–128 character password."
            });
        }

        const exists = await User.findOne({email}).lean();
        if (exists) {
            return res.status(409).json({message: "An account with this email already exists."});
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({name, email, passwordHash});

        logger.info("USER REGISTERED", {userId: user._id.toString()});

        return res.status(201).json({
            token: sign(user),
            user: publicUser(user)
        });
    } catch (error) {
        logger.error("Registration error", {message: error.message});
        return res.status(500).json({message: "Unable to create account."});
    }
});

router.post("/login", async (req, res) => {
    try {
        const email = normalizeEmail(req.body?.email);
        const password = req.body?.password;

        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required."});
        }

        const user = await User.findOne({email});
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({message: "Invalid email or password."});
        }

        logger.info("USER LOGIN", {userId: user._id.toString()});

        return res.json({
            token: sign(user),
            user: publicUser(user)
        });
    } catch (error) {
        logger.error("Login error", {message: error.message});
        return res.status(500).json({message: "Unable to sign in."});
    }
});

router.get("/me", requireAuth, async (req, res) => {
    res.json({user: publicUser(req.user)});
});

export default router;
