const express = require('express')
const { getAllCourse, getCourseById, addNewCourse, updateCourse, deleteCourse} = require('../controllers/courseController')
const { upload } = require('../middleware/fileUpload')
const { authUser } = require('../middleware/userAuth')
// const { upload } = require('../config/cloudinaryConfig')
// const { upload } = require('../middleware/fileUpload')
// const upload = require('../middleware/fileUpload')


const router = express.Router()

router.get('/', getAllCourse)

router.get('/:courseId', getCourseById)

router.post("/", upload.array("images" ,4), addNewCourse);

// router.post('/'  , addNewCourse)

router.patch('/:courseId', updateCourse)

router.delete('/:courseId', deleteCourse)

module.exports = router;