
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.JWT_SECRET;

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find(req.query);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
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
} catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
}
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(404).json({ message: "User Not Deleted", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
  getAllUsers,
  deleteUser
};
