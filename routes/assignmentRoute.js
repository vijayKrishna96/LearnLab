const express = require('express')
const { getAllAssignments, createAssignment, getAssignmentById, updateAssignment, deleteAssignment } = require('../controllers/assignmentController')

const router = express.Router()

router.get('/' , getAllAssignments)

router.get('/:id' , getAssignmentById)

router.post('/', createAssignment)

router.patch('/:id' , updateAssignment)

router.delete('/:id' , deleteAssignment)

module.exports = router;