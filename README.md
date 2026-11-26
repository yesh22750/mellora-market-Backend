# Mellora Market Backend

Production-ready REST API backend for **Mellora Market**, a premium full-stack MERN e-commerce application.

The backend provides the API layer for the Mellora Market storefront and handles authentication, products, shopping cart, wishlist/user functionality, reviews, checkout, orders, inventory, admin operations, and MongoDB data persistence.

---

## 🚀 Live Backend

### Production Backend

https://mellora-market-backend.onrender.com

### Production API

**Open this URL to see the live API response:**

https://mellora-market-backend.onrender.com/api

The API returns a JSON response showing the backend service status and MongoDB connection status.

### Health Check

https://mellora-market-backend.onrender.com/api/health

### Products API

https://mellora-market-backend.onrender.com/api/products

The Products API returns the live product catalogue stored in MongoDB.

---

## 🛍️ Project Overview

**Mellora Market** is a full-stack e-commerce platform built using the MERN stack.

The project is designed around a premium fashion and lifestyle shopping experience, with a modern responsive React frontend connected to a Node.js/Express REST API and MongoDB database.

The backend is responsible for securely managing application data and business logic between the frontend and database.

### Backend Responsibilities

- User registration and login
- JWT-based authentication
- Password hashing
- Product catalogue management
- Product details
- Shopping cart management
- Wishlist/user functionality
- Product reviews and ratings
- Checkout and order creation
- Inventory and stock validation
- Customer order history
- Admin functionality
- MongoDB database integration
- API request logging
- Error logging
- CORS configuration
- Rate limiting
- HTTP security headers
- Production API deployment

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin API access |
| Helmet | HTTP security |
| express-rate-limit | API rate limiting |
| Winston | Application and error logging |
| dotenv | Environment configuration |
| Nodemon | Development server |

---

## 🏗️ Backend Architecture

```text
                    Mellora Market React
                         Frontend
                            │
                            │ HTTP / REST API
                            ▼
                 ┌───────────────────────┐
                 │      Express.js       │
                 │       Node.js         │
                 ├───────────────────────┤
                 │ Authentication        │
                 │ Products              │
                 │ Cart                  │
                 │ Orders                │
                 │ Reviews               │
                 │ Users                 │
                 │ Admin                 │
                 ├───────────────────────┤
                 │ Middleware            │
                 │ JWT / CORS / Helmet   │
                 │ Rate Limiting         │
                 └───────────┬───────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Mongoose     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     MongoDB     │
                    └─────────────────┘
```

---

## 🔐 Authentication

The backend uses **JWT authentication** for protected customer and admin functionality.

### Authentication features

- User registration
- User login
- Secure password hashing using bcryptjs
- JWT token generation
- Protected routes
- User identity verification
- Role-based admin access

JWT tokens are configured with a 7-day expiration period.

---

## 📦 Product Management

The backend provides product catalogue APIs connected directly to MongoDB.

Each product can contain:

- Product name
- Slug
- Description
- Price
- Category
- Material
- Color
- Stock quantity
- Product image
- Rating
- Review count

The current catalogue includes categories such as:

- Fashion
- Bags
- Accessories
- Home
- Footwear
- Lifestyle

---

## 🛒 Shopping Cart

Authenticated customers can manage their shopping cart through the backend API.

Cart functionality includes:

- Add products
- Update quantities
- Remove products
- Clear cart
- Guest cart merging
- Stock validation
- Maximum quantity validation
- Automatic subtotal calculation

Cart data is persisted in MongoDB for authenticated users.

---

## ⭐ Reviews & Ratings

Customers can review products through the API.

Features include:

- 1–5 star ratings
- Written reviews
- Review retrieval
- Review creation/update
- Product average rating calculation
- Review count calculation

Each authenticated user can maintain their review for a product.

---

## 📦 Checkout & Orders

The backend handles order creation and validates the entire checkout request before saving the order.

### Order processing includes

1. Validate authenticated user
2. Validate customer delivery information
3. Validate products
4. Validate quantities
5. Check product availability
6. Verify current product prices
7. Calculate subtotal
8. Calculate delivery charges
9. Reserve product stock
10. Create the order
11. Remove purchased items from the cart
12. Store the order in MongoDB

Stock is validated on the server rather than trusting prices or quantities supplied by the frontend.

### Delivery pricing

Orders meeting the configured free-delivery threshold receive free delivery. Smaller orders receive the configured delivery charge.

---

## 👤 User Management

The backend supports customer accounts with:

- Registration
- Login
- Authentication
- User profile retrieval
- Role information
- Order history
- Cart persistence
- Reviews

Sensitive password information is not returned through public user responses.

---

## 👑 Admin Functionality

Protected admin routes provide administrative functionality for managing the e-commerce application.

Admin authorization is handled using the user's JWT role.

The backend distinguishes between:

```text
customer
admin
```

This prevents normal customer accounts from accessing protected administrative functionality.

---

## 🔒 Security

The backend includes several production-focused security measures.

### Implemented security features

- JWT authentication
- bcrypt password hashing
- Protected API routes
- Admin role authorization
- Helmet security headers
- CORS origin validation
- API rate limiting
- Request validation
- MongoDB ObjectId validation
- Stock validation
- Environment-based secrets
- Structured application logging
- Error logging

The backend also disables the Express `X-Powered-By` header.

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get authenticated user |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product details |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get current user's cart |
| POST | `/api/cart/items` | Add product to cart |
| PATCH | `/api/cart/items/:productId` | Update product quantity |
| DELETE | `/api/cart/items/:productId` | Remove product |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/cart/merge` | Merge guest cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/mine` | Get customer's orders |
| GET | `/api/orders` | Get authorized orders |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews/:productId` | Get product reviews |
| POST | `/api/reviews/:productId` | Create/update review |

### Users

User routes provide authenticated customer account functionality.

### Admin

Admin routes provide protected administrative functionality.

---

## 🧪 Live API Examples

### API Status

Open:

https://mellora-market-backend.onrender.com/api

Example response:

```json
{
  "status": "ok",
  "service": "Mellora Market API",
  "database": "connected"
}
```

### Health Check

Open:

https://mellora-market-backend.onrender.com/api/health

Example response:

```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Products

Open:

https://mellora-market-backend.onrender.com/api/products

The response contains the live product catalogue retrieved from MongoDB.

---

## 🗄️ Database Models

The backend uses Mongoose models for the main application entities.

```text
User
Product
Cart
Order
Review
```

Relationships are managed using MongoDB ObjectIds and Mongoose references.

---

## 🌱 Product Seeding

The project includes a `seed.js` script for initially populating the product catalogue and creating/updating the admin account.

### Important

The current seed script contains:

```js
await Product.deleteMany({});
```

Therefore, running:

```bash
npm run seed
```

will clear the existing product collection before inserting the seed catalogue.

**Do not run the seed script against production unless replacing the complete product catalogue is intentional.**

For targeted product image changes, the project includes:

```text
updateProductImages.js
```

This script updates only the specified product records without deleting the complete catalogue.

---

## 🖼️ Product Image Updates

The backend includes a safe targeted update script:

```text
updateProductImages.js
```

It can update selected product image URLs using their product slugs.

This is safer than running the complete seed process when only individual product data needs to be changed.

---

## ⚙️ Environment Variables

Create a local `.env` file using `.env.example` as the reference.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_secure_jwt_secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Mellora Admin
```

### Production

Production environment variables are configured through the hosting provider.

Sensitive credentials such as:

```text
MONGODB_URI
JWT_SECRET
ADMIN_PASSWORD
```

must never be committed to GitHub.

---

## 💻 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/yesh22750/mellora-market-backend.git
```

### 2. Enter the backend directory

```bash
cd mellora-market-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env
```

and configure the required MongoDB, JWT and application settings.

### 5. Start the development server

```bash
npm run dev
```

The local API will normally run at:

```text
http://localhost:5000/api
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server using Nodemon |
| `npm start` | Start production Node.js server |
| `npm run seed` | Seed product catalogue and admin |
| `npm run check` | Check JavaScript syntax |
| `npm run logs` | Display configured log file locations |

---

## 📝 Logging

The backend uses **Winston** for structured logging.

The application records important backend events including:

- HTTP requests
- User registration
- User login
- Product retrieval
- Cart operations
- Order creation
- MongoDB connection events
- Server errors
- Application errors

---

## 📁 Project Structure

```text
backend/
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── Review.js
│
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   ├── users.js
│   ├── reviews.js
│   └── admin.js
│
├── utils/
│   └── logger.js
│
├── logs/
│
├── seed.js
├── updateProductImages.js
├── server.js
├── package.json
├── package-lock.json
├── .env.example
└── .gitignore
```

---

## ☁️ Deployment

The backend is deployed using **Render**.

### Backend

https://mellora-market-backend.onrender.com

### API

https://mellora-market-backend.onrender.com/api

### Database

MongoDB

The production backend connects to MongoDB through the `MONGODB_URI` environment variable.

---

## 🔗 Frontend Integration

The backend is connected to the Mellora Market React frontend.

### Frontend

https://mellora-market-frontend.vercel.app

### Backend

https://mellora-market-backend.onrender.com

### API Base URL

https://mellora-market-backend.onrender.com/api

The React frontend uses:

```env
VITE_API_URL=https://mellora-market-backend.onrender.com/api
```

to communicate with the production backend.

---

## 🌍 CORS Configuration

The backend uses CORS to control which frontend applications can communicate with the API.

The production frontend origin should be configured through:

```env
CLIENT_URL
```

Local development can use:

```text
http://localhost:5173
http://127.0.0.1:5173
```

For production, the stable Vercel frontend URL should be preferred over temporary Vercel preview deployment URLs.

---

## ✅ Project Status

### Backend Completed

- [x] Node.js backend
- [x] Express REST API
- [x] MongoDB integration
- [x] Mongoose models
- [x] User registration
- [x] User login
- [x] JWT authentication
- [x] bcrypt password hashing
- [x] Product catalogue
- [x] Product details
- [x] Shopping cart
- [x] Guest cart merge
- [x] Wishlist/user functionality
- [x] Product reviews
- [x] Product ratings
- [x] Checkout
- [x] Order creation
- [x] Inventory validation
- [x] Customer order history
- [x] Admin functionality
- [x] CORS configuration
- [x] Helmet security
- [x] Rate limiting
- [x] Request logging
- [x] Error logging
- [x] Production MongoDB connection
- [x] Production Render deployment
- [x] Live REST API
- [x] Safe product image update script

---

## 🔍 API Verification

Anyone reviewing the project can verify that the production backend is running by opening:

### Main API

https://mellora-market-backend.onrender.com/api

### Health API

https://mellora-market-backend.onrender.com/api/health

### Products API

https://mellora-market-backend.onrender.com/api/products

These endpoints provide live responses from the deployed Express backend.

---

## 👨‍💻 Project

**Mellora Market**

A full-stack MERN e-commerce application focused on delivering a premium fashion and lifestyle shopping experience.

### Repository

https://github.com/yesh22750/mellora-market-backend

### Live Backend

https://mellora-market-backend.onrender.com

### Live API

https://mellora-market-backend.onrender.com/api

### Frontend

https://mellora-market-frontend.vercel.app

---

## 📄 License

This project is developed as a personal full-stack e-commerce and portfolio project.
