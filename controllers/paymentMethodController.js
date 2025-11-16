// controllers/paymentMethodController.js
import PaymentMethod from "../models/PaymentMethod.js";

// Get all payment methods for a user
export const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    console.log('🔍 Fetching payment methods for user:', userId);
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required in query parameters' 
      });
    }

    const methods = await PaymentMethod.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    
    console.log(`✅ Found ${methods.length} payment methods for user ${userId}`);
    
    res.json(methods);
  } catch (err) {
    console.error('❌ Error fetching payment methods:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create new payment method
export const createPaymentMethod = async (req, res) => {
  try {
    const { user, type, phone_number, card_holder, last_four, expiry, paypal_email, isDefault } = req.body;

    console.log('📝 Creating payment method for user:', user, req.body);

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // If this is the first payment method, set it as default
    const existingMethods = await PaymentMethod.find({ user: user });
    const shouldBeDefault = isDefault || existingMethods.length === 0;

    // If setting as default, unset other defaults
    if (shouldBeDefault) {
      await PaymentMethod.updateMany(
        { user: user },
        { $set: { isDefault: false } }
      );
    }

    const newMethod = new PaymentMethod({
      user,
      type,
      phone_number,
      card_holder,
      last_four,
      expiry,
      paypal_email,
      isDefault: shouldBeDefault
    });

    const savedMethod = await newMethod.save();
    console.log('✅ Payment method created:', savedMethod._id);
    
    res.status(201).json(savedMethod);
  } catch (err) {
    console.error('❌ Error creating payment method:', err);
    res.status(400).json({ message: err.message });
  }
};

// Set payment method as default
export const setDefaultPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log('⭐ Setting default payment method:', id, 'for user:', userId);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    //setting all payment methods to non-default
    await PaymentMethod.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    //set the selected payment method as default
    const method = await PaymentMethod.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!method) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment method not found' 
      });
    }

    console.log('✅ Default payment method set:', id);
    
    res.json({ 
      success: true, 
      paymentMethod: method 
    });
  } catch (err) {
    console.error('❌ Error setting default payment method:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log('🗑️ Deleting payment method:', id, 'for user:', userId);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const method = await PaymentMethod.findOneAndDelete({ _id: id, user: userId });
    
    if (!method) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment method not found' 
      });
    }

    console.log('✅ Payment method deleted:', id);

    // If we deleted the default payment method, set another one as default
    if (method.isDefault) {
      const remainingMethod = await PaymentMethod.findOne({ user: userId });
      if (remainingMethod) {
        await PaymentMethod.findByIdAndUpdate(remainingMethod._id, { isDefault: true });
        console.log('🔄 New default payment method set:', remainingMethod._id);
      }
    }

    res.json({ 
      success: true, 
      message: 'Payment method deleted successfully' 
    });
  } catch (err) {
    console.error('❌ Error deleting payment method:', err);
    res.status(500).json({ message: 'Failed to delete payment method' });
  }
};