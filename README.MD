# Afrimart Backend API

> A robust Node.js + Express backend API for the Afrimart e-commerce platform, powered by MongoDB and Mongoose.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Overview

Afrimart Backend is a comprehensive e-commerce API that handles user authentication, product management, shopping cart operations, orders, and payments. Built with modern web technologies and best practices for scalability and security.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Environment Management:** dotenv
- **Development:** Nodemon (for hot reloading)

## Features

✅ User authentication and authorization with JWT

✅ Product catalog management with categories and filtering

✅ Shopping cart functionality with persistent storage

✅ Order management and tracking

✅ Payment method integration

✅ Address management for shipping

✅ RESTful API design with proper HTTP status codes

✅ Error handling and validation middleware

✅ Database seeding for development

✅ CORS support for frontend integration

## Project Structure

```
afrimart-backend/
├── controllers/          # Request handlers for each route
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── addressController.js
│   └── paymentMethodController.js
├── models/              # Mongoose schemas and models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Address.js
│   └── PaymentMethod.js
├── routes/              # API route definitions
│   ├── UserRoutes.js
│   ├── ProductRoutes.js
│   ├── OrderRoutes.js
│   ├── AddressRoutes.js
│   └── PaymentMethodRoutes.js
├── server.js            # Server entry point
├── seed.js              # Database seeding script
├── package.json         # Project dependencies
└── README.md            # This file
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas for cloud hosting
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the Repository**

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd afrimart-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This will install all required packages listed in `package.json`:
   - express
   - mongoose
   - jsonwebtoken
   - bcryptjs
   - express-validator
   - cors
   - dotenv
   - nodemon (dev dependency)

### Environment Setup

1. **Create a `.env` file** in the root directory:

   ```bash
   touch .env
   ```

2. **Add the following environment variables:**

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/afrimart
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/afrimart

   ```

3. **Database Connection:**

   Make sure MongoDB is running before starting the server:

   ```bash
   # Windows (if installed locally)
   mongod

   # macOS (using Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

### Running the Server

**Development Mode** (with hot reload):

```bash
npm run dev
```

The server will start on `http://localhost:5000` and automatically reload when you make changes.

**Production Mode:**

```bash
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user and get JWT token |
| GET | `/profile` | Get current user profile (protected) |
| PUT | `/profile` | Update user profile (protected) |

### Product Routes (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all products with pagination |
| GET | `/:id` | Get product by ID |
| POST | `/` | Create new product (admin only) |
| PUT | `/:id` | Update product (admin only) |
| DELETE | `/:id` | Delete product (admin only) |

### Cart Routes (`/api/cart`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's cart (protected) |
| POST | `/add` | Add item to cart (protected) |
| PUT | `/update/:itemId` | Update cart item quantity (protected) |
| DELETE | `/remove/:itemId` | Remove item from cart (protected) |
| POST | `/checkout` | Proceed to checkout (protected) |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new order (protected) |
| GET | `/` | Get user's orders (protected) |
| GET | `/:id` | Get order details (protected) |
| PUT | `/:id` | Update order status (admin only) |

### Address Routes (`/api/addresses`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's addresses (protected) |
| POST | `/` | Add new address (protected) |
| PUT | `/:id` | Update address (protected) |
| DELETE | `/:id` | Delete address (protected) |

### Payment Methods Routes (`/api/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get payment methods (protected) |
| POST | `/` | Add payment method (protected) |
| DELETE | `/:id` | Remove payment method (protected) |

## Database Models

### User Model
- Email, password (hashed)
- Full name, phone number
- Authentication tokens
- Timestamps

### Product Model
- Name, description, price
- Category, inventory count
- Images/thumbnail URLs
- Ratings and reviews

### Order Model
- Order number, status
- Items, quantities, prices
- Shipping and billing addresses
- Payment method and status
- Timestamps

### Address Model
- Street address, city, state
- Postal code, country
- Address type (shipping/billing)
- Default address flag

### PaymentMethod Model
- Payment type (card, M-Pesa, etc.)
- Masked account/card details
- Expiry information
- Default payment flag

## Configuration

### Database Seeding

To populate the database with initial data:

```bash
npm run seed
```

This will:
- Create sample users
- Add products to the catalog
- Set up payment methods
- Initialize addresses

### Port Configuration

Default port is `5000`. To use a different port, set the `PORT` environment variable:

```bash
PORT=3000 npm run dev
```

### CORS Configuration

Modify the `CORS_ORIGIN` in `.env` to allow requests from your frontend:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## Contributing

1. Create a new branch for your feature: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

## Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Made with ❤️ by the Afrimart Development Team**

