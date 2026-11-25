import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import {requireAuth} from "../middleware/auth.js";

const router = express.Router();

router.get("/:productId", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) {
            return res.status(400).json({message: "Invalid product id."});
        }

        const reviews = await Review.find({product: req.params.productId})
            .sort({createdAt: -1})
            .populate("user", "name");

        return res.json({reviews});
    } catch {
        return res.status(500).json({message: "Failed to load reviews."});
    }
});

router.post("/:productId", requireAuth, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) {
            return res.status(400).json({message: "Invalid product id."});
        }

        const product = await Product.exists({_id: req.params.productId});
        if (!product) {
            return res.status(404).json({message: "Product not found."});
        }

        const rating = Number(req.body?.rating);
        const comment = String(req.body?.comment || "").trim();

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({message: "Rating must be 1 to 5."});
        }

        if (comment.length > 500) {
            return res.status(400).json({message: "Review must be 500 characters or less."});
        }

        const review = await Review.findOneAndUpdate(
            {product: req.params.productId, user: req.user._id},
            {rating, comment},
            {upsert: true, new: true, setDefaultsOnInsert: true}
        );

        return res.status(201).json({review});
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({message: "You already reviewed this product."});
        }
        return res.status(500).json({message: "Unable to save review."});
    }
});

export default router;
