import UserAddress from "../models/Address.js";

// Get all addresses for a user
export const getAddresses = async (req, res) => {
  try {
    // Get user ID from query parameter
    const userId = req.query.userId;
    
    console.log('🔍 Fetching addresses for user:', userId);
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required in query parameters' 
      });
    }

    const addresses = await UserAddress.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
    
    console.log(`✅ Found ${addresses.length} addresses for user ${userId}`);
    
    res.json({ 
      success: true, 
      addresses 
    });
  } catch (err) {
    console.error('❌ Error fetching addresses:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch addresses',
      error: err.message 
    });
  }
};

// Create new address
export const createAddress = async (req, res) => {
  try {
    const { userId, address_line_1, address_line_2, city, state_region, postal_code, country, type } = req.body;

    console.log('📝 Creating address for user:', userId);
    console.log('📦 Request body:', req.body);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Validate required fields
    if (!address_line_1 || !city || !postal_code) {
      return res.status(400).json({
        success: false,
        message: 'Address line 1, city, and postal code are required'
      });
    }

    // If this is the first address, set it as default
    const existingAddresses = await UserAddress.find({ user: userId });
    console.log(`📊 Found ${existingAddresses.length} existing addresses for user ${userId}`);
    
    const isDefault = existingAddresses.length === 0;

    const newAddress = new UserAddress({
      user: userId,
      address_line_1,
      address_line_2: address_line_2 || '',
      city,
      state_region: state_region || '',
      postal_code,
      country: country || 'Kenya',
      type: type || 'Home',
      isDefault
    });

    console.log('💾 About to save address to database...');
    
    const savedAddress = await newAddress.save();
    
    console.log('✅ Address saved successfully!');
    console.log('📄 Saved address document:', savedAddress);
    console.log('🆔 MongoDB _id:', savedAddress._id);
    
    // Verifying the address was actually saved by fetching it back
    const verifiedAddress = await UserAddress.findById(savedAddress._id);
    console.log('🔍 Verified address from database:', verifiedAddress);
    
    res.status(201).json({ 
      success: true, 
      address: savedAddress 
    });
  } catch (err) {
    console.error('❌ Error creating address:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    
    console.log('📝 Updating address:', id, 'for user:', userId);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const address = await UserAddress.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({ 
        success: false, 
        message: 'Address not found' 
      });
    }

    const updatedAddress = await UserAddress.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    console.log('✅ Address updated:', id);
    
    res.json({ 
      success: true, 
      address: updatedAddress 
    });
  } catch (err) {
    console.error('❌ Error updating address:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Set address as default
export const setDefaultAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    console.log('⭐ Setting default address:', id, 'for user:', userId);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    //setting all addresses to non-default
    await UserAddress.updateMany(
      { user: userId },
      { $set: { isDefault: false } }
    );

    // Then set the selected address as default
    const address = await UserAddress.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ 
        success: false, 
        message: 'Address not found' 
      });
    }

    console.log('✅ Default address set:', id);
    
    res.json({ 
      success: true, 
      address 
    });
  } catch (err) {
    console.error('❌ Error setting default address:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    console.log('🗑️ Deleting address:', id, 'for user:', userId);

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const address = await UserAddress.findOneAndDelete({ _id: id, user: userId });
    
    if (!address) {
      return res.status(404).json({ 
        success: false, 
        message: 'Address not found' 
      });
    }

    console.log('✅ Address deleted:', id);

    // If we deleted the default address, set another one as default
    if (address.isDefault) {
      const remainingAddress = await UserAddress.findOne({ user: userId });
      if (remainingAddress) {
        await UserAddress.findByIdAndUpdate(remainingAddress._id, { isDefault: true });
        console.log('🔄 New default address set:', remainingAddress._id);
      }
    }

    res.json({ 
      success: true, 
      message: 'Address deleted successfully' 
    });
  } catch (err) {
    console.error('❌ Error deleting address:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete address' 
    });
  }
};