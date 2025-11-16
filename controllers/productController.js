import Product from "../models/Product.js";

// get products
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


// get a single product
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
