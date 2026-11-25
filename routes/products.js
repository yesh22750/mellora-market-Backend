import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import logger from "../utils/logger.js";

const router = express.Router();

async function productWithRating(product) {
    const stats = await Review.aggregate([
        {$match: {product: product._id}},
        {
            $group: {
                _id: "$product",
                rating: {$avg: "$rating"},
                reviewCount: {$sum: 1}
            }
        }
    ]);

    const result = stats[0];
    return {
        ...product.toObject(),
        rating: result ? Number(result.rating.toFixed(1)) : 5,
        reviewCount: result?.reviewCount || 0
    };
}

router.get("/", async (_req, res) => {
    try {
        const products = await Product.find({}).sort({createdAt: -1}).lean();
        const stats = await Review.aggregate([
            {
                $group: {
                    _id: "$product",
                    rating: {$avg: "$rating"},
                    reviewCount: {$sum: 1}
                }
            }
        ]);

        const byProduct = new Map(
            stats.map(item => [
                item._id.toString(),
                {
                    rating: Number(item.rating.toFixed(1)),
                    reviewCount: item.reviewCount
                }
            ])
        );

        const enriched = products.map(product => ({
            ...product,
            rating: byProduct.get(product._id.toString())?.rating || 5,
            reviewCount: byProduct.get(product._id.toString())?.reviewCount || 0
        }));

        logger.info("Products fetched from MongoDB", {count: enriched.length});
        return res.json({products: enriched});
    } catch (error) {
        logger.error("Product fetch error", {message: error.message});
        return res.status(500).json({message: "Failed to fetch products."});
    }
});

router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({message: "Invalid product id."});
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({message: "Product not found."});
        }

        return res.json({product: await productWithRating(product)});
    } catch (error) {
        logger.error("Product detail error", {message: error.message});
        return res.status(500).json({message: "Failed to fetch product."});
    }
});

export default router;
