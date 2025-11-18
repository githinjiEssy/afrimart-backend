import Product from "../models/Product.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Convert Decimal128 to numbers for frontend
    const parsedProducts = products.map((p) => ({
      ...p.toObject(),
      price: p.price ? parseFloat(p.price.toString()) : 0,
      rating: p.rating ? parseFloat(p.rating.toString()) : 0,
    }));

    res.json(parsedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Convert Decimal128 fields to numbers
    const parsedProduct = {
      ...product.toObject(),
      price: product.price ? parseFloat(product.price.toString()) : 0,
      rating: product.rating ? parseFloat(product.rating.toString()) : 0,
    };

    res.json(parsedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new product
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Create new product
    const product = new Product(productData);
    const savedProduct = await product.save();

    // Convert Decimal128 to numbers for response
    const parsedProduct = {
      ...savedProduct.toObject(),
      price: savedProduct.price ? parseFloat(savedProduct.price.toString()) : 0,
      rating: savedProduct.rating ? parseFloat(savedProduct.rating.toString()) : 0,
    };

    res.status(201).json(parsedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Convert Decimal128 to numbers for response
    const parsedProduct = {
      ...updatedProduct.toObject(),
      price: updatedProduct.price ? parseFloat(updatedProduct.price.toString()) : 0,
      rating: updatedProduct.rating ? parseFloat(updatedProduct.rating.toString()) : 0,
    };

    res.json(parsedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};