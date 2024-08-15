const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    // courseId: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
    category: { type: String },
    price: { type: Number, required: true },
    duration: { type: Number },
    thumbnail: { type: String },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
