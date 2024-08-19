const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUserDetails, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/userAuth');

// Route for registering a new user
router.post('/register', registerUser);

// Route for logging in a user
router.post('/login', loginUser);

// Route for getting user details 
router.get('/me',  getUserDetails);

router.get('/users', getAllUsers)

router.delete('/:userId', protect, admin , deleteUser)

module.exports = router;
