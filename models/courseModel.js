const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
});

const moduleSchema = new mongoose.Schema({
    moduleNumber: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
    category: { type: String },
    price: { type: Number, required: true },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '', // URL or path to the course image
    },
    modules: [moduleSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
