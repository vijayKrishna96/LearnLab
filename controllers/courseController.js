// const cloudinaryInstance = require("../config/cloudinaryConfig");
const Course = require("../models/courseModel");
const { cloudinary } = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");
const { uploadCloudinary } = require("../utils/uploadCloudinary");

const addNewCourse = async (req, res) => {
  try {
      const {
          title,
          description,
          category,
          price,
          modules,
          instructor
      } = req.body;

      // Parse modules data if it's sent as a string
      const parsedModules = typeof modules === 'string' ? JSON.parse(modules) : modules;

      // Validate required fields
      if (!title || !description || !category || !price || !parsedModules) {
          return res.status(400).json({
              success: false,
              message: "All required fields must be provided"
          });
      }

      // Handle image uploads
      let uploadedImages = [];
      if (req.files && req.files.length > 0) {
          // Upload each image to Cloudinary
          const uploadPromises = req.files.map(async (file, index) => {
              const publicId = `courses/${Date.now()}-${index}`;
              const result = await uploadCloudinary(file.path, publicId);
              
              return {
                  publicId: result.public_id,
                  url: result.secure_url
              };
          });

          uploadedImages = await Promise.all(uploadPromises);
      }

      // Use the first image as course main image
      const courseImage = uploadedImages[0] || null;

      // Process modules and map remaining images to lessons
      let imageIndex = 1; // Start from second image, as first is used for course
      const processedModules = parsedModules.map(module => {
          const processedLessons = module.lessons.map(lesson => {
              // Assign an image to the lesson if available
              const lessonImage = imageIndex < uploadedImages.length 
                  ? uploadedImages[imageIndex++] 
                  : null;

              return {
                  title: lesson.title,
                  duration: lesson.duration,
                  image: lessonImage
              };
          });

          return {
              moduleNumber: module.moduleNumber,
              title: module.title,
              lessons: processedLessons
          };
      });

      // Create new course
      const newCourse = new Course({
          title,
          description,
          category,
          price: Number(price),
          instructor, // Assuming you have user info from auth middleware
          image: courseImage,
          modules: processedModules
      });

      // Save the course
      await newCourse.save();

      // Send response
      return res.status(201).json({
          success: true,
          message: "Course created successfully",
          course: newCourse
      });

  } catch (error) {
      // Clean up any uploaded files if there's an error
      console.error("Error in addNewCourse:", error);
      return res.status(500).json({
          success: false,
          message: "Failed to create course",
          error: error.message
      });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find(req.query).exec();
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
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

    res
      .status(200)
      .json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(
      req.params.courseId
    ).exec();
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};

module.exports = {
  getAllCourse,
  getCourseById,
  addNewCourse,
  updateCourse,
  deleteCourse,
};
