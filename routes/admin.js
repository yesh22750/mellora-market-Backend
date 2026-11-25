import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import {requireAdmin, requireAuth} from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/summary", async (_req, res) => {
    try {
        const [products, orders, revenue] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                {$match: {status: {$ne: "Cancelled"}}},
                {$group: {_id: null, total: {$sum: "$totalAmount"}}}
            ])
        ]);

        return res.json({
            products,
            orders,
            revenue: revenue[0]?.total || 0
        });
    } catch {
        return res.status(500).json({message: "Failed to load admin summary."});
    }
});

router.patch("/orders/:id/status", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({message: "Invalid order id."});
        }

        const allowed = [
            "Processing",
            "Shipped",
            "Out for delivery",
            "Delivered",
            "Cancelled"
        ];

        if (!allowed.includes(req.body?.status)) {
            return res.status(400).json({message: "Invalid order status."});
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({message: "Order not found."});
        }

        const nextStatus = req.body.status;
        if (order.status === "Cancelled" && nextStatus !== "Cancelled") {
            return res.status(409).json({message: "Cancelled orders cannot be reopened."});
        }

        if (order.status !== "Cancelled" && nextStatus === "Cancelled") {
            await Promise.all(
                order.items
                    .filter(item => item.product)
                    .map(item =>
                        Product.updateOne(
                            {_id: item.product},
                            {$inc: {stock: item.quantity}}
                        )
                    )
            );
        }

        order.status = nextStatus;
        await order.save();

        return res.json({order});
    } catch {
        return res.status(500).json({message: "Unable to update order status."});
    }
});

export default router;
