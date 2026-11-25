import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, trim: true},
        slug: {type: String, required: true, unique: true, trim: true},
        description: {type: String, required: true},
        price: {type: Number, required: true, min: 0},
        category: {type: String, required: true, trim: true},
        image: {type: String, required: true},
        material: {type: String, default: ""},
        color: {type: String, default: ""},
        stock: {type: Number, default: 20, min: 0}
    },
    {timestamps: true}
);

export default mongoose.model("Product", productSchema);
