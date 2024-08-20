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
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUsersById = async (req, res) => {
  try {
    const student = await User.Student.findById(req.params.userId).exec();
    const instructor = await User.Instructor.findById(req.params.userId).exec();
    const admin = await User.Admin.findById(req.params.userId).exec();
  
    const userById = [student, instructor, admin].filter(user => user !== null);

    if (userById.length === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(userById);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, profilePicture } = req.body;

    const existingUser =
      (await User.Student.findOne({ email })) ||
      (await User.Instructor.findOne({ email })) ||
      (await User.Admin.findOne({ email }));
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      let user;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      if (role === "student") {
        user = new User.Student({ name, email, password: hashedPassword ,profilePicture });
      } else if (role === "instructor") {
        const { bio, expertise } = req.body;
        user = new User.Instructor({
          name,
          email,
          password: hashedPassword,
          bio,
          expertise,
          profilePicture
        });
      } else if (role === "admin") {
        user = new User.Admin({ name, email, password: hashedPassword , profilePicture});
      } else {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      await user.save();
      res
        .status(201)
        .json({ message: `${role} registered successfully`, user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const [updatedStudent, updatedInstructor, updatedAdmin] = await Promise.all([
      User.Student.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true }).exec(),
      User.Instructor.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true }).exec(),
      User.Admin.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true }).exec(),
    ]);

    const updatedUser = [updatedStudent, updatedInstructor, updatedAdmin].filter(user => user !== null);

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;

    let user =
      (await User.Student.findByIdAndDelete(id)) ||
      (await User.Instructor.findByIdAndDelete(id)) ||
      (await User.Admin.findByIdAndDelete(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUsersById,
  registerUser,
  updateUser,
  deleteUser
};
