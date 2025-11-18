import Order from "../models/order.js";

//get orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product")
      .populate("shipping_address")
      .populate("payment_details");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product")
      .populate("shipping_address")
      .populate("payment_details");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders for specific user by user ID
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId; // Get user ID from URL parameter
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const orders = await Order.find({ user: userId })
      .populate("user", "firstname lastname email")
      .populate("items.product", "name product_image_url")
      .populate("shipping_address")
      .populate("payment_details")
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: err.message });
  }
};

//create order
export const createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//update order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete order
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};