import express from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import {requireAuth} from "../middleware/auth.js";
import logger from "../utils/logger.js";

const router = express.Router();
const MAX_QTY = 20;

function cleanQuantity(value) {
    const quantity = Number(value);
    return Number.isInteger(quantity) ? quantity : NaN;
}

async function formatCart(cart) {
    const ids = cart.items.map(item => item.product);
    const products = ids.length ? await Product.find({_id: {$in: ids}}).lean() : [];
    const byId = new Map(products.map(product => [product._id.toString(), product]));

    const items = cart.items
        .map(item => {
            const product = byId.get(item.product.toString());
            if (!product) return null;
            return {
                id: product._id.toString(),
                product: product._id.toString(),
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: Math.min(item.quantity, Math.max(0, product.stock))
            };
        })
        .filter(Boolean)
        .filter(item => item.quantity > 0);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {items, subtotal, count: items.reduce((sum, item) => sum + item.quantity, 0)};
}

async function getOrCreateCart(userId) {
    let cart = await Cart.findOne({user: userId});
    if (!cart) cart = await Cart.create({user: userId, items: []});
    return cart;
}

router.get("/", requireAuth, async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        const formatted = await formatCart(cart);
        return res.json(formatted);
    } catch (error) {
        logger.error("Cart fetch error", {message: error.message});
        return res.status(500).json({message: "Failed to load your bag."});
    }
});

router.post("/items", requireAuth, async (req, res) => {
    try {
        const productId = req.body?.product;
        const requested = cleanQuantity(req.body?.quantity);

        if (!mongoose.isValidObjectId(productId) || !Number.isInteger(requested) || requested < 1 || requested > MAX_QTY) {
            return res.status(400).json({message: "Invalid product or quantity."});
        }

        const product = await Product.findById(productId).lean();
        if (!product) return res.status(404).json({message: "Product not found."});
        if (product.stock < 1) return res.status(409).json({message: "This product is currently out of stock."});

        const cart = await getOrCreateCart(req.user._id);
        const existing = cart.items.find(item => item.product.toString() === productId.toString());
        const current = existing?.quantity || 0;
        const next = Math.min(product.stock, current + requested, MAX_QTY);
        const added = Math.max(0, next - current);

        if (!added) {
            return res.status(409).json({message: `Only ${Math.min(product.stock, MAX_QTY)} available for ${product.name}.`});
        }

        if (existing) existing.quantity = next;
        else cart.items.push({product: product._id, quantity: next});

        await cart.save();
        const formatted = await formatCart(cart);
        return res.json({
            ...formatted,
            added,
            message: added < requested ? `Only ${next} available — bag updated.` : `${product.name} added to your bag.`
        });
    } catch (error) {
        logger.error("Cart add error", {message: error.message});
        return res.status(500).json({message: "Unable to add this item to your bag."});
    }
});

router.patch("/items/:productId", requireAuth, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) return res.status(400).json({message: "Invalid product id."});
        const quantity = cleanQuantity(req.body?.quantity);
        if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QTY) return res.status(400).json({message: "Quantity must be between 0 and 20."});

        const cart = await getOrCreateCart(req.user._id);
        const item = cart.items.find(entry => entry.product.toString() === req.params.productId);
        if (!item) return res.status(404).json({message: "Item is not in your bag."});

        if (quantity === 0) {
            cart.items = cart.items.filter(entry => entry.product.toString() !== req.params.productId);
        } else {
            const product = await Product.findById(req.params.productId).lean();
            if (!product) return res.status(404).json({message: "Product not found."});
            if (product.stock < quantity) return res.status(409).json({message: `${product.name} has only ${product.stock} left in stock.`});
            item.quantity = quantity;
        }

        await cart.save();
        return res.json(await formatCart(cart));
    } catch (error) {
        logger.error("Cart quantity update error", {message: error.message});
        return res.status(500).json({message: "Unable to update your bag."});
    }
});

router.delete("/items/:productId", requireAuth, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) return res.status(400).json({message: "Invalid product id."});
        const cart = await getOrCreateCart(req.user._id);
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        await cart.save();
        return res.json(await formatCart(cart));
    } catch (error) {
        logger.error("Cart item removal error", {message: error.message});
        return res.status(500).json({message: "Unable to remove this item."});
    }
});

router.delete("/", requireAuth, async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        cart.items = [];
        await cart.save();
        return res.json({items: [], subtotal: 0, count: 0});
    } catch (error) {
        logger.error("Cart clear error", {message: error.message});
        return res.status(500).json({message: "Unable to clear your bag."});
    }
});

router.post("/merge", requireAuth, async (req, res) => {
    try {
        const guestItems = Array.isArray(req.body?.items) ? req.body.items : [];
        const cart = await getOrCreateCart(req.user._id);

        for (const guestItem of guestItems.slice(0, 50)) {
            if (!mongoose.isValidObjectId(guestItem?.id)) continue;
            const requested = cleanQuantity(guestItem.quantity);
            if (!Number.isInteger(requested) || requested < 1) continue;

            const product = await Product.findById(guestItem.id).lean();
            if (!product || product.stock < 1) continue;

            const existing = cart.items.find(item => item.product.toString() === product._id.toString());
            const current = existing?.quantity || 0;
            const next = Math.min(MAX_QTY, product.stock, current + requested);

            if (existing) existing.quantity = next;
            else if (next > 0) cart.items.push({product: product._id, quantity: next});
        }

        await cart.save();
        return res.json(await formatCart(cart));
    } catch (error) {
        logger.error("Guest cart merge error", {message: error.message});
        return res.status(500).json({message: "Unable to sync your bag."});
    }
});

export default router;
