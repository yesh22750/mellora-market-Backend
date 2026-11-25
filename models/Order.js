import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true, min: 1},
        image: {type: String, default: ""}
    },
    {_id: false}
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {type: String, unique: true, required: true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},
        customer: {
            name: {type: String, required: true},
            email: {type: String, required: true},
            phone: {type: String, required: true},
            address: {type: String, required: true},
            city: {type: String, required: true},
            pincode: {type: String, required: true}
        },
        items: {type: [orderItemSchema], required: true},
        totalAmount: {type: Number, required: true},
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Out for delivery", "Delivered", "Cancelled"],
            default: "Processing"
        }
    },
    {timestamps: true}
);

export default mongoose.model("Order", orderSchema);
