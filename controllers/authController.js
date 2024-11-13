const User = require('../models/userModel')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { generateUserToken } = require('../utils/generateToken');


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in any of the roles (Student, Instructor, Admin)
    const user =
    await User.Student.findOne({ email }).select('+password') ||
    await User.Instructor.findOne({ email }).select('+password') ||
    await User.Admin.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
      
    }
    if (!user.active) {
      return res.status(400).json({ message: 'User is not active' });
    }
  
    // Generate JWT token
    const token = generateUserToken(user.email, user.role , user._id);

    const options = {
      httpOnly: true,
      secure: true,
    }

    // Set token in an HTTP-only cookie
    res.cookie('token', token , options);

    // Send success response with role information
    res.status(200).json({
      success: true,
      message: `${user.role} Login Successful`,
      user: { id: user._id, role: user.role },
      
    });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
  
};
  
  const verifyLogin = async (req, res) => {
    try {
      if (req.cookies.token) {
        res.status(200).json({ message: 'Logged in' });
      } else {
        res.status(401).json({ message: 'Unauthorized access' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error verifying login', error: error.message });
    }
  };
  
  const logout = async (req, res) => {
    try {
      res.clearCookie('token',);
      // { path: '/', domain: 'your-domain.com' }
      res.status(200).json({success: true, message: 'Logged out' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error: error.message });
    }
  };

  module.exports = {
    loginUser,
    verifyLogin,
    logout
  }