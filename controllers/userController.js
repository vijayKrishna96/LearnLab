const User = require('../models/userModel');
const bcrypt = require('bcrypt')
const saltRounds = 10;

const getAllUsers = async (req, res) => {
    try {
      const user = await User.find(req.query);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  };

  const getUsersById = async (req, res) => {
    try {
      const userById = await User.findById(req.params.userId).exec();
  
      if (!userById) {
        return res.status(404).json({ message: "User Not Found" });
      }
      res.status(200).json(userById);
    } catch {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const addNewUser = async (req, res) => {
    try {
        const userData = req.body;
        const saltRounds = 10;
        const hash = bcrypt.hashSync(userData.password, saltRounds);
        const user = new User({
            ...userData,
            password: hash
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Error adding user", error: error.message });
    }
  };

    const updateUser = async (req, res) => {
      try {
          const updatedUser = await User.findByIdAndUpdate(
              req.params.userId,
              req.body,
              { new: true } // Return the updated document
          );
  
          if (!updatedUser) {
              return res.status(404).json({ message: "User not found" });
          }
  
          res.status(200).json({ message: "User updated", updatedUser });
      } catch (error) {
          res.status(500).json({ message: "Error updating user", error });
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
    getAllUsers,
    getUsersById,
    addNewUser,
    updateUser,
    deleteUser,
  };
  