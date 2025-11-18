import User from "../models/User.js";
import bcrypt from "bcryptjs";
import path from "path";

/* ---------------------------------------------
   GET ALL USERS
--------------------------------------------- */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------
   GET SINGLE USER
--------------------------------------------- */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------
   CREATE USER (SIGNUP)
--------------------------------------------- */
export const createUser = async (req, res) => {
  try {
    const { email, password, firstname, lastname, username, phone, profile_img } = req.body;

    // Validation
    if (!email || !password || !firstname || !lastname || !username) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Check email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User with this email already exists" });

    // Check username
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already taken" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      phone: phone || null,
      password: hashedPassword,
      profile_img: profile_img || "default-avatar.png"
    });

    const savedUser = await newUser.save();

    // Response without password
    const userResponse = {
      _id: savedUser._id,
      firstname: savedUser.firstname,
      lastname: savedUser.lastname,
      username: savedUser.username,
      email: savedUser.email,
      phone: savedUser.phone,
      profile_img: savedUser.profile_img,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    };

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------------------------------------------
   LOGIN USER
--------------------------------------------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // User response (no password)
    const userResponse = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      profile_img: user.profile_img,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      message: "Login successful",
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------
   UPDATE USER
--------------------------------------------- */
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate username if username is being updated
    if (updateData.username && updateData.username !== existingUser.username) {
      const usernameExists = await User.findOne({ 
        username: updateData.username, 
        _id: { $ne: userId } 
      });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Check for duplicate email if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await User.findOne({ 
        email: updateData.email, 
        _id: { $ne: userId } 
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email already taken" });
      }
    }

    // Hash password if updating
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Handle phone field - set to null if empty string
    if (updateData.phone === '') {
      updateData.phone = null;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    res.status(400).json({ message: err.message });
  }
};

/* ---------------------------------------------
   DELETE USER
--------------------------------------------- */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "User account deleted successfully",
      deletedUserId: userId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};