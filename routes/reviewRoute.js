const express = require('express');
const { getAllReview, getReviewById, addNewReview, updateReview, deleteReview, getReviewsByCourse } = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getAllReview)

router.get('/:reviewId', getReviewById)

router.get(':/courseId', getReviewsByCourse)

router.post('/' , addNewReview)

router.patch('/:reviewId', updateReview)

router.delete('/:reviewId', deleteReview)

module.exports = router;
