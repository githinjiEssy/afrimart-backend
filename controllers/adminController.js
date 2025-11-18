import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Admin registration (without JWT)
export const registerAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, password, profile_img } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profile_img: profile_img || 'default-profile.png',
      role: 'admin'
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        _id: savedUser._id,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        profile_img: savedUser.profile_img,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin login (without JWT)
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        _id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        profile_img: admin.profile_img,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Get all admins (protected route)
export const getAllAdmins = async (req, res) => {
  try {
    // Verify token and admin role
    const tokenResult = await verifyTokenAndAdmin(req);
    if (!tokenResult.success) {
      return res.status(tokenResult.status).json({
        success: false,
        message: tokenResult.message
      });
    }

    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });

  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get admin by ID
export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify token and admin role
    const tokenResult = await verifyTokenAndAdmin(req);
    if (!tokenResult.success) {
      return res.status(tokenResult.status).json({
        success: false,
        message: tokenResult.message
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' }).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Get admin by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update admin profile
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, profile_img } = req.body;

    // Verify token and admin role
    const tokenResult = await verifyTokenAndAdmin(req);
    if (!tokenResult.success) {
      return res.status(tokenResult.status).json({
        success: false,
        message: tokenResult.message
      });
    }

    // Check if admin is updating their own profile
    if (tokenResult.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own profile.'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: id } 
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already taken'
        });
      }
    }

    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (email) updateData.email = email;
    if (profile_img) updateData.profile_img = profile_img;

    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete admin (soft delete)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify token and admin role
    const tokenResult = await verifyTokenAndAdmin(req);
    if (!tokenResult.success) {
      return res.status(tokenResult.status).json({
        success: false,
        message: tokenResult.message
      });
    }

    // Prevent self-deletion
    if (tokenResult.user.userId === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const deletedAdmin = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!deletedAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin account deactivated successfully',
      admin: deletedAdmin
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get admin dashboard statistics
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Verify token and admin role
    const tokenResult = await verifyTokenAndAdmin(req);
    if (!tokenResult.success) {
      return res.status(tokenResult.status).json({
        success: false,
        message: tokenResult.message
      });
    }

    // Get statistics
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstname lastname email createdAt');

    const stats = {
      totalUsers,
      totalAdmins,
      recentUsers,
      // Add more stats here based on your business logic
    };

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Helper function to verify token and admin role
export const verifyTokenAndAdmin = async (req) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return { success: false, status: 401, message: 'Access denied. No token provided.' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'admin') {
      return { success: false, status: 403, message: 'Access denied. Admin privileges required.' };
    }

    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, status: 401, message: 'Invalid token' };
  }
};

// Get current admin profile
export const getCurrentAdmin = async (req, res) => {
  try {
    // Verify token and admin role
    const tokenResult = await verifyTokenAndAdmin(req);
    if (!tokenResult.success) {
      return res.status(tokenResult.status).json({
        success: false,
        message: tokenResult.message
      });
    }

    const admin = await User.findById(tokenResult.user.userId).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
