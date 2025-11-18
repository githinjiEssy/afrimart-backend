import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import { fileURLToPath } from 'url';
import path from "path";

// Load environment variables
dotenv.config();

import UserRoutes from "./routes/UserRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import AddressRoutes from "./routes/AddressRoutes.js";
import PaymentMethodRoutes from "./routes/PaymentMethodRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


//MongoDB connection
const connectDB = async () => {
  try {
    // Use the DATABASE_NAME from environment variables
    const mongoURI = process.env.MONGO_URI + process.env.DATABASE_NAME;
    
    console.log('🔗 Connecting to MongoDB:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

//routes
app.use("/users", UserRoutes);
app.use("/products", ProductRoutes);
app.use("/addresses", AddressRoutes);
app.use("/payment-methods", PaymentMethodRoutes);
app.use("/orders", OrderRoutes);
app.use("/admin", AdminRoutes);

// Serve static files from uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));