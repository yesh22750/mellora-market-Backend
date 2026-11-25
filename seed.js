import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const products = [
    // =========================
    // FASHION
    // =========================

    {
        name: "Linen Atelier Shirt",
        slug: "linen-atelier-shirt",
        description:
            "A relaxed premium linen shirt with a softly tailored silhouette and refined everyday finish.",
        price: 2490,
        category: "Fashion",
        material: "Premium Linen",
        color: "Natural Ivory",
        stock: 25,
        image:
            "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Soft Knit Cardigan",
        slug: "soft-knit-cardigan",
        description:
            "A softly textured knit layer with an easy silhouette for effortless transitional dressing.",
        price: 2790,
        category: "Fashion",
        material: "Cotton Blend",
        color: "Oat",
        stock: 22,
        image:
            "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Classic Oxford Shirt",
        slug: "classic-oxford-shirt",
        description:
            "A timeless Oxford shirt designed for polished everyday styling.",
        price: 2290,
        category: "Fashion",
        material: "Cotton",
        color: "Cloud White",
        stock: 28,
        image:
            "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Relaxed Linen Trousers",
        slug: "relaxed-linen-trousers",
        description:
            "Lightweight linen trousers with a relaxed fit and sophisticated everyday character.",
        price: 2990,
        category: "Fashion",
        material: "Premium Linen",
        color: "Sand",
        stock: 20,
        image:
            "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Minimal Overshirt",
        slug: "minimal-overshirt",
        description:
            "A versatile overshirt with clean construction and a modern relaxed silhouette.",
        price: 3190,
        category: "Fashion",
        material: "Cotton Twill",
        color: "Sage Green",
        stock: 18,
        image:
            "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Everyday Ribbed Top",
        slug: "everyday-ribbed-top",
        description:
            "A refined ribbed top designed for effortless layering and everyday comfort.",
        price: 1590,
        category: "Fashion",
        material: "Cotton Rib",
        color: "Cream",
        stock: 35,
        image:
            "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Tailored Evening Blazer",
        slug: "tailored-evening-blazer",
        description:
            "A sophisticated tailored blazer with a clean profile for elevated occasions.",
        price: 5490,
        category: "Fashion",
        material: "Premium Blend",
        color: "Espresso",
        stock: 12,
        image:
            "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Essential Polo Knit",
        slug: "essential-polo-knit",
        description:
            "A refined polo knit combining relaxed comfort with a polished finish.",
        price: 2490,
        category: "Fashion",
        material: "Cotton Knit",
        color: "Stone",
        stock: 24,
        image:
            "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    // =========================
    // BAGS
    // =========================

    {
        name: "Sculpted Everyday Tote",
        slug: "sculpted-everyday-tote",
        description:
            "A structured everyday tote designed with clean lines, generous space and a quiet luxury feel.",
        price: 3290,
        category: "Bags",
        material: "Vegan Leather",
        color: "Espresso",
        stock: 18,
        image:
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Structured Shoulder Bag",
        slug: "structured-shoulder-bag",
        description:
            "A compact structured shoulder bag designed for elegant everyday styling.",
        price: 3590,
        category: "Bags",
        material: "Vegan Leather",
        color: "Black",
        stock: 16,
        image:
            "https://images.pexels.com/photos/1152078/pexels-photo-1152078.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Soft Crescent Bag",
        slug: "soft-crescent-bag",
        description:
            "A softly curved everyday bag with a modern minimalist silhouette.",
        price: 2890,
        category: "Bags",
        material: "Faux Leather",
        color: "Mocha",
        stock: 21,
        image:
            "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Canvas Weekend Tote",
        slug: "canvas-weekend-tote",
        description:
            "A spacious canvas tote made for weekend plans, travel and everyday carry.",
        price: 2190,
        category: "Bags",
        material: "Heavy Canvas",
        color: "Natural",
        stock: 27,
        image:
            "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Mini Evening Clutch",
        slug: "mini-evening-clutch",
        description:
            "A sleek compact clutch designed to complement refined evening looks.",
        price: 1990,
        category: "Bags",
        material: "Vegan Leather",
        color: "Champagne",
        stock: 14,
        image:
            "https://images.pexels.com/photos/1152076/pexels-photo-1152076.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    // =========================
    // ACCESSORIES
    // =========================

    {
        name: "Minimal Gold Watch",
        slug: "minimal-gold-watch",
        description:
            "A refined minimalist watch with a slim profile designed to complement everyday looks.",
        price: 4590,
        category: "Accessories",
        material: "Stainless Steel",
        color: "Champagne Gold",
        stock: 15,
        image:
            "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Editorial Leather Wallet",
        slug: "editorial-leather-wallet",
        description:
            "A compact wallet with understated detailing and a timeless finish.",
        price: 1590,
        category: "Accessories",
        material: "Vegan Leather",
        color: "Dark Brown",
        stock: 40,
        image:
            "https://images.pexels.com/photos/11676702/pexels-photo-11676702.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Classic Sunglasses",
        slug: "classic-sunglasses",
        description:
            "Timeless sunglasses with a clean frame designed for everyday sophistication.",
        price: 1890,
        category: "Accessories",
        material: "Acetate",
        color: "Tortoiseshell",
        stock: 26,
        image:
            "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Slim Leather Belt",
        slug: "slim-leather-belt",
        description:
            "A minimal belt with a refined buckle and versatile everyday styling.",
        price: 1290,
        category: "Accessories",
        material: "Leather",
        color: "Dark Brown",
        stock: 32,
        image:
            "https://images.pexels.com/photos/19090/pexels-photo-19090.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Silk Accent Scarf",
        slug: "silk-accent-scarf",
        description:
            "A lightweight silk scarf adding a subtle editorial touch to everyday outfits.",
        price: 1490,
        category: "Accessories",
        material: "Silk Blend",
        color: "Sage",
        stock: 23,
        image:
            "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Minimalist Bracelet",
        slug: "minimalist-bracelet",
        description:
            "A refined bracelet with a simple silhouette designed for understated styling.",
        price: 1790,
        category: "Accessories",
        material: "Stainless Steel",
        color: "Gold",
        stock: 29,
        image:
            "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    // =========================
    // HOME
    // =========================

    {
        name: "Sage Ceramic Set",
        slug: "sage-ceramic-set",
        description:
            "Hand-finished ceramic pieces in a muted sage tone for calm, considered table settings.",
        price: 1890,
        category: "Home",
        material: "Stoneware",
        color: "Sage",
        stock: 30,
        image:
            "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Ivory Home Candle",
        slug: "ivory-home-candle",
        description:
            "A warm, elegant home fragrance designed to make quiet evenings feel a little more special.",
        price: 1290,
        category: "Home",
        material: "Soy Wax",
        color: "Ivory",
        stock: 35,
        image:
            "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Stoneware Coffee Mug",
        slug: "stoneware-coffee-mug",
        description:
            "A beautifully proportioned stoneware mug for slow mornings and everyday rituals.",
        price: 790,
        category: "Home",
        material: "Stoneware",
        color: "Warm Beige",
        stock: 45,
        image:
            "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Textured Ceramic Vase",
        slug: "textured-ceramic-vase",
        description:
            "A sculptural ceramic vase designed to bring quiet character to modern interiors.",
        price: 1690,
        category: "Home",
        material: "Ceramic",
        color: "Off White",
        stock: 24,
        image:
            "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Linen Cushion Cover",
        slug: "linen-cushion-cover",
        description:
            "A naturally textured linen cushion cover designed for relaxed, elevated interiors.",
        price: 990,
        category: "Home",
        material: "Linen",
        color: "Oat",
        stock: 38,
        image:
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Minimal Table Lamp",
        slug: "minimal-table-lamp",
        description:
            "A softly sculpted table lamp bringing warm ambient light to modern spaces.",
        price: 2490,
        category: "Home",
        material: "Metal & Glass",
        color: "Cream",
        stock: 17,
        image:
            "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Oak Serving Board",
        slug: "oak-serving-board",
        description:
            "A natural oak serving board designed for relaxed entertaining and everyday use.",
        price: 1390,
        category: "Home",
        material: "Oak Wood",
        color: "Natural Oak",
        stock: 20,
        image:
            "https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Soft Cotton Throw",
        slug: "soft-cotton-throw",
        description:
            "A soft woven throw that adds warmth and texture to your living space.",
        price: 2190,
        category: "Home",
        material: "Cotton",
        color: "Cream",
        stock: 19,
        image:
            "https://images.pexels.com/photos/1267438/pexels-photo-1267438.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    // =========================
    // FOOTWEAR
    // =========================

    {
        name: "Classic Leather Loafer",
        slug: "classic-leather-loafer",
        description:
            "A polished everyday loafer with a classic profile and comfortable all-day construction.",
        price: 3990,
        category: "Footwear",
        material: "Leather",
        color: "Espresso",
        stock: 20,
        image:
            "https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Minimal Leather Sneaker",
        slug: "minimal-leather-sneaker",
        description:
            "A clean leather sneaker designed to pair effortlessly with everyday outfits.",
        price: 3490,
        category: "Footwear",
        material: "Leather",
        color: "Off White",
        stock: 24,
        image:
            "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Suede Everyday Sneaker",
        slug: "suede-everyday-sneaker",
        description:
            "A softly structured suede sneaker with a timeless everyday profile.",
        price: 3290,
        category: "Footwear",
        material: "Suede",
        color: "Taupe",
        stock: 18,
        image:
            "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Elegant Ankle Boot",
        slug: "elegant-ankle-boot",
        description:
            "A refined ankle boot with a streamlined silhouette for polished seasonal dressing.",
        price: 4890,
        category: "Footwear",
        material: "Leather",
        color: "Dark Brown",
        stock: 13,
        image:
            "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Soft Everyday Sandal",
        slug: "soft-everyday-sandal",
        description:
            "A minimalist sandal designed for warm-weather comfort and understated style.",
        price: 2290,
        category: "Footwear",
        material: "Faux Leather",
        color: "Tan",
        stock: 26,
        image:
            "https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    // =========================
    // LIFESTYLE
    // =========================

    {
        name: "Travel Leather Journal",
        slug: "travel-leather-journal",
        description:
            "A refined journal designed for notes, plans, ideas and everyday reflection.",
        price: 1190,
        category: "Lifestyle",
        material: "Vegan Leather",
        color: "Cognac",
        stock: 31,
        image:
            "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Minimal Desk Organizer",
        slug: "minimal-desk-organizer",
        description:
            "A clean desk organizer designed to keep everyday essentials beautifully arranged.",
        price: 1490,
        category: "Lifestyle",
        material: "Wood",
        color: "Walnut",
        stock: 22,
        image:
            "https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Insulated Travel Bottle",
        slug: "insulated-travel-bottle",
        description:
            "A sleek reusable bottle designed to keep drinks at the right temperature throughout the day.",
        price: 1390,
        category: "Lifestyle",
        material: "Stainless Steel",
        color: "Sage",
        stock: 34,
        image:
            "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Premium Everyday Backpack",
        slug: "premium-everyday-backpack",
        description:
            "A refined everyday backpack with a clean silhouette and practical storage.",
        price: 3590,
        category: "Lifestyle",
        material: "Recycled Fabric",
        color: "Charcoal",
        stock: 16,
        image:
            "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Essential Travel Pouch",
        slug: "essential-travel-pouch",
        description:
            "A compact organizer pouch for keeping everyday travel essentials together.",
        price: 990,
        category: "Lifestyle",
        material: "Canvas",
        color: "Natural",
        stock: 42,
        image:
            "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },

    {
        name: "Premium Desk Notebook",
        slug: "premium-desk-notebook",
        description:
            "A beautifully finished notebook made for ideas, planning and everyday notes.",
        price: 690,
        category: "Lifestyle",
        material: "Recycled Paper",
        color: "Ivory",
        stock: 50,
        image:
            "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB connected for seed");

        // Clear existing products
        await Product.deleteMany({});

        // Insert all 35 products
        await Product.insertMany(products);

        // Create / update admin account
        if (
            process.env.ADMIN_EMAIL &&
            process.env.ADMIN_PASSWORD
        ) {
            const passwordHash = await bcrypt.hash(
                process.env.ADMIN_PASSWORD,
                12
            );

            await User.findOneAndUpdate(
                {
                    email: process.env.ADMIN_EMAIL.toLowerCase()
                },
                {
                    name:
                        process.env.ADMIN_NAME ||
                        "Mellora Admin",
                    email:
                        process.env.ADMIN_EMAIL.toLowerCase(),
                    passwordHash,
                    role: "admin"
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );

            console.log(
                "👑 Admin account seeded from environment variables"
            );
        }

        console.log(
            `🌱 Seeded ${products.length} elegant products`
        );

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();