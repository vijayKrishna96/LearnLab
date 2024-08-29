const express = require('express');
const { getAllStudyPlan, getStudyPlanById, createStudyPlan, updateStudyPlan, deleteStudyPlan } = require('../controllers/studyPlanController');
const router = express.Router();

router.get('/', getAllStudyPlan)

router.get('/:id', getStudyPlanById)

router.post('/', createStudyPlan)

router.patch('/:id', updateStudyPlan)

router.delete('/:id', deleteStudyPlan)

module.exports = router