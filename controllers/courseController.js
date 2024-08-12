const Course = require('../models/courseModel');


const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find(req.query).exec(); 
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
    try {
        const courseById = await Course.findById(req.params.courseId).exec();

        if (!courseById) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(courseById);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add a new course
const addNewCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const course = new Course(courseData); 

        const savedCourse = await course.save();
        res.status(201).json({ message: "Course created successfully", savedCourse });
    } catch (error) {
        res.status(500).json({ message: "Error adding course", error: error.message });
    }
};

// Update an existing course by ID
const updateCourse = async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.courseId,
            req.body,
            { new: true } 
        ).exec();

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully", updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error: error.message });
    }
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.courseId).exec();
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error: error.message });
    }
};

module.exports = {
    getAllCourse,
    getCourseById,
    addNewCourse,
    updateCourse,
    deleteCourse
};
