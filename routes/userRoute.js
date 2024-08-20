const express = require('express');
const { getAllUsers, getUsersById, registerUser, updateUser, deleteUser, } = require('../controllers/userController');
const { protect, admin } = require('../middleware/Protected');
const router = express.Router();


router.get ('/users' , getAllUsers);

router.get('/:userId' , getUsersById)

router.post('/register' , registerUser)

router.patch('/update/:userId' , updateUser)

router.delete('/delete/:userId', protect , admin , deleteUser)

module.exports = router;
