import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const updates = [
    {
        slug: "structured-shoulder-bag",
        image:
            "https://images.pexels.com/photos/14837856/pexels-photo-14837856.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        slug: "mini-evening-clutch",
        image:
            "https://images.pexels.com/photos/8575226/pexels-photo-8575226.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
        slug: "slim-leather-belt",
        image:
            "https://images.pexels.com/photos/4164506/pexels-photo-4164506.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
];

async function updateProductImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB connected");

        for (const product of updates) {
            const result = await Product.updateOne(
                { slug: product.slug },
                { $set: { image: product.image } }
            );

            if (result.matchedCount === 0) {
                console.log(`⚠️ Product not found: ${product.slug}`);
            } else {
                console.log(`✅ Updated image: ${product.slug}`);
            }
        }

        console.log("🎉 Product image update completed");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Update failed:", error);

        await mongoose.connection.close();
        process.exit(1);
    }
}

updateProductImages();