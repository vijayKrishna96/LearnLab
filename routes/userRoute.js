const express = require('express');
const { getAllUsers, getUsersById, registerUser, updateUser, deleteUser,  userProfile, checkUser, getUserById, updateInstructor, updateStudent } = require('../controllers/userController');
const { protect, admin } = require('../middleware/Protected');
const { authUser } = require('../middleware/userAuth');
const { upload } = require('../middleware/fileUpload');
const router = express.Router();


router.get ('/profile' ,authUser,  userProfile);

router.get('/users' , getAllUsers)

router.get('/checkUser' ,authUser, checkUser)

router.get('/:userId' , getUsersById);

router.get('/user/:userId', getUserById)

router.post('/register' , registerUser);

router.patch('/update/:userId' ,upload.single("images"), updateUser);

router.patch('/update/instructor/:userId' , upload.single("images"),updateInstructor );


router.delete('/delete/:userId', deleteUser);


module.exports = router;
