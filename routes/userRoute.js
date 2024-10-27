const express = require('express');
const { getAllUsers, getUsersById, registerUser, updateUser, deleteUser,  userProfile, checkUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/Protected');
const { authUser } = require('../middleware/userAuth');
const router = express.Router();


router.get ('/profile' ,authUser,  userProfile);

router.get('/users' , getAllUsers)

router.get('/checkUser' ,authUser, checkUser)

router.get('/:userId' , getUsersById);

router.post('/register' , registerUser);

router.patch('/update/:userId' , updateUser);

router.delete('/delete/:userId', deleteUser);


module.exports = router;
