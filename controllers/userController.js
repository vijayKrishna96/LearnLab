
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.JWT_SECRET;

const getAllUsers = async (req, res) => {
  try {
    const students = await User.Student.find({});
    const instructors = await User.Instructor.find({});
    const admins = await User.Admin.find({});

    const users = [...students, ...instructors, ...admins];
    res.json({ users });
} catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
}
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.Student.findOne({ email }) || await User.Instructor.findOne({ email }) || await User.Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }else{
      let user;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
        user = new User.Student({ name, email, password: hashedPassword });
    } else if (role === 'instructor') {
        const { bio, expertise } = req.body;
        user = new User.Instructor({ name, email, password: hashedPassword, bio, expertise });
    } else if (role === 'admin') {
        user = new User.Admin({ name, email, password: hashedPassword });
    } else {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    await user.save();
    res.status(201).json({ message: `${role} registered successfully`, user });
}
    }
     catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
}
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.Student.findOne({ email }) || await User.Instructor.findOne({ email }) || await User.Admin.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password)

    console.log(isMatch)

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
} catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
}
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

 const deleteUser = async (req, res) => {
  try {
    const  id  = req.params.userId;
   
    let user = await User.Student.findByIdAndDelete(id) || await User.Instructor.findByIdAndDelete(id) || await User.Admin.findByIdAndDelete(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
} catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
}
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
  getAllUsers,
  deleteUser
};
