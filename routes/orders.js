import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import logger from "../utils/logger.js";
import {requireAuth} from "../middleware/auth.js";

const router = express.Router();

function makeOrderNumber() {
    return `MM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function cleanCustomer(customer = {}, user) {
    return {
        name: String(customer.name || user.name || "").trim(),
        email: String(customer.email || user.email || "").trim().toLowerCase(),
        phone: String(customer.phone || "").trim(),
        address: String(customer.address || "").trim(),
        city: String(customer.city || "").trim(),
        pincode: String(customer.pincode || "").trim()
    };
}

function validCustomer(customer) {
    return (
        customer.name.length >= 2 &&
        customer.name.length <= 80 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) &&
        /^[0-9+()\-\\s]{10,15}$/.test(customer.phone) &&
        customer.address.length >= 5 &&
        customer.address.length <= 300 &&
        customer.city.length >= 2 &&
        customer.city.length <= 80 &&
        /^\d{6}$/.test(customer.pincode)
    );
}

router.post("/", requireAuth, async (req, res) => {
    const reserved = [];

    try {
        const customer = cleanCustomer(req.body?.customer, req.user);
        const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];

        if (!rawItems.length) {
            return res.status(400).json({message: "Your bag is empty."});
        }

        if (!validCustomer(customer)) {
            return res.status(400).json({message: "Please enter valid delivery details."});
        }

        const merged = new Map();

        for (const item of rawItems) {
            if (!mongoose.isValidObjectId(item?.product)) {
                return res.status(400).json({message: "One or more products are invalid."});
            }

            const quantity = Number(item.quantity);
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
                return res.status(400).json({message: "Each product quantity must be between 1 and 20."});
            }

            const key = item.product.toString();
            merged.set(key, (merged.get(key) || 0) + quantity);

            if (merged.get(key) > 20) {
                return res.status(400).json({message: "Maximum quantity per product is 20."});
            }
        }

        const validItems = [];
        let calculatedTotal = 0;

        for (const [productId, quantity] of merged.entries()) {
            const product = await Product.findById(productId).lean();

            if (!product) {
                return res.status(400).json({message: "A product in your bag no longer exists."});
            }

            if (product.stock < quantity) {
                return res.status(409).json({
                    message: `${product.name} has only ${product.stock} left in stock.`
                });
            }

            validItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.image
            });

            calculatedTotal += product.price * quantity;
        }

        const delivery = calculatedTotal >= 1499 ? 0 : 79;
        const totalAmount = calculatedTotal + delivery;

        // Reserve stock atomically. If any reservation fails, restore earlier reservations.
        for (const item of validItems) {
            const result = await Product.updateOne(
                {_id: item.product, stock: {$gte: item.quantity}},
                {$inc: {stock: -item.quantity}}
            );

            if (result.modifiedCount !== 1) {
                throw Object.assign(new Error(`${item.name} is no longer available in the requested quantity.`), {
                    statusCode: 409
                });
            }

            reserved.push(item);
        }

        const order = await Order.create({
            orderNumber: makeOrderNumber(),
            user: req.user._id,
            customer,
            items: validItems,
            totalAmount,
            status: "Processing"
        });

        await Cart.updateOne({user: req.user._id}, {$pull: {items: {product: {$in: validItems.map(item => item.product)}}}});

        logger.info("ORDER SAVED TO MONGODB", {
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            userId: req.user._id.toString()
        });

        return res.status(201).json({
            message: "Order created successfully.",
            order
        });
    } catch (error) {
        if (reserved.length) {
            await Promise.all(
                reserved.map(item =>
                    Product.updateOne(
                        {_id: item.product},
                        {$inc: {stock: item.quantity}}
                    )
                )
            );
        }

        logger.error("Order creation error", {message: error.message});

        if (error.statusCode) {
            return res.status(error.statusCode).json({message: error.message});
        }

        return res.status(500).json({message: "Failed to create order."});
    }
});

router.get("/mine", requireAuth, async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id})
            .sort({createdAt: -1})
            .lean();

        return res.json({orders});
    } catch (error) {
        logger.error("Customer orders fetch error", {message: error.message});
        return res.status(500).json({message: "Failed to load your orders."});
    }
});

router.get("/", requireAuth, async (req, res) => {
    try {
        const orders = req.user.role === "admin"
            ? await Order.find({}).sort({createdAt: -1}).lean()
            : await Order.find({user: req.user._id}).sort({createdAt: -1}).lean();

        return res.json({orders});
    } catch (error) {
        logger.error("Orders fetch error", {message: error.message});
        return res.status(500).json({message: "Failed to load orders."});
    }
});

export default router;
