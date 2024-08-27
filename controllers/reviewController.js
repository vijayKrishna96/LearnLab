const Review = require('../models/reviewModel');


const getAllReview = async (req, res) => {
    try {
        const reviews = await Review.find(req.query).exec(); 
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};


const getReviewById = async (req, res) => {
    try {
        const reviewById = await Review.findById(req.params.reviewId).exec();

        if (!reviewById) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(reviewById);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const addNewReview = async (req, res) => {
    try {
        const { studentId, courseId, rating, comment } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).json({ message: 'Student ID and Course ID are required' });
        }

        const review = new Review({
            student: studentId,
            course: courseId,
            rating,
            comment,
        });

        await review.save();
        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.reviewId,
            req.body,
            { new: true } 
        ).exec();

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review updated", updatedReview });
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error: error.message });
    }
};


const deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.reviewId).exec();
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
};

const getReviewsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseReviews = await Review.find({ course: courseId }).exec();

        if (!courseReviews || courseReviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this course" });
        }

        res.status(200).json(courseReviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course reviews", error: error.message });
    }
};

module.exports = {
    getAllReview,
    getReviewById,
    addNewReview,
    updateReview,
    deleteReview,
    getReviewsByCourse
};
