const express = require('express')
const { getAllCourse, getCourseById, addNewCourse, updateCourse, deleteCourse } = require('../controllers/courseController')


const router = express.Router()

router.get('/', getAllCourse)

router.get('/:courseId', getCourseById)

router.post('/' , addNewCourse)

router.patch('/:courseId', updateCourse)

router.delete('/:courseId', deleteCourse)

module.exports = router;