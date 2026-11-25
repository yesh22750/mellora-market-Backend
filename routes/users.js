import express from "express";
import mongoose from "mongoose";
import {requireAuth} from "../middleware/auth.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/wishlist", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        return res.json({products: user?.wishlist || []});
    } catch {
        return res.status(500).json({message: "Failed to load wishlist."});
    }
});

router.post("/wishlist/:productId", requireAuth, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) {
            return res.status(400).json({message: "Invalid product id."});
        }

        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({message: "Product not found."});
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({message: "User no longer exists."});
        }

        const id = product._id.toString();
        const exists = user.wishlist.some(item => item.toString() === id);

        if (exists) {
            user.wishlist = user.wishlist.filter(item => item.toString() !== id);
        } else {
            user.wishlist.push(product._id);
        }

        await user.save();

        return res.json({
            message: "Wishlist updated.",
            wished: !exists
        });
    } catch {
        return res.status(500).json({message: "Unable to update wishlist."});
    }
});

export default router;
