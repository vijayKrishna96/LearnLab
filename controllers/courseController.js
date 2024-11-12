// const cloudinaryInstance = require("../config/cloudinaryConfig");
const Course = require("../models/courseModel");
// const {User, Student, Instructor, Admin} = require("../models/userModel")
const { cloudinary } = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");
const { uploadCloudinary, deleteFromCloudinary } = require("../utils/uploadCloudinary");
const { User } = require("../models/userModel");

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
    const courses = await Course.find(req.query)
      .populate('categoryDetails', 'name')
      .populate('instructorDetails', 'name email profileImage')
      .populate('studentDetails', 'name email profileImage')
      .exec();

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

//Get CourseBy UserId
const getCoursesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user role from the database
    const user = await User.findById(userId).select('role');

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userRole = user.role; // Assuming the role field is stored as 'role'
    let courses = [];

    if (userRole === 'instructor') {
      courses = await Course.find({ instructor: userId })
        .populate('category', 'name')
        .populate('instructor', 'name email')
        .select('title description price image.url averageRating')
        .exec();
    } else if (userRole === 'student') {
      courses = await Course.find({ students: userId })
        .populate('category', 'name')
        .populate('instructor', 'name email')
        .select('title description price image.url averageRating')
        .exec();
    } else {
      return res.status(403).json({ message: "Access denied. Invalid role." });
    }

    // Return the fetched courses as an array
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by userId:", error);
    res.status(500).json({ message: "Server error. Unable to fetch courses." });
  }
};


// Update an existing course by ID
const updateCourse = async (req, res) => {
  try {
      const courseId = req.params.courseId;
      const {
          title,
          description,
          category,
          price,
          modules,
          instructor,
          students
      } = req.body;

      // Find existing course
      const existingCourse = await Course.findById(courseId);
      if (!existingCourse) {
          return res.status(404).json({
              success: false,
              message: "Course not found"
          });
      }

      if (students) {
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { $addToSet: { students: students } },  // Use $addToSet to avoid duplicates
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Course students updated successfully",
          course: updatedCourse
        });
      }

      // Parse modules data if it's sent as a string
      const parsedModules = typeof modules === 'string' ? JSON.parse(modules) : modules;

      // Handle image uploads
      let uploadedImages = [];
      if (req.files && req.files.length > 0) {
          // Delete existing images from Cloudinary if they exist
          if (existingCourse.image) {
              await deleteFromCloudinary(existingCourse.image.publicId);
          }
          existingCourse.modules.forEach(module => {
              module.lessons.forEach(lesson => {
                  if (lesson.image) {
                      deleteFromCloudinary(lesson.image.publicId);
                  }
              });
          });

          // Upload new images to Cloudinary
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

      // Use the first image as course main image or keep existing
      const courseImage = uploadedImages[0] || existingCourse.image;

      // Process modules and map remaining images to lessons
      let imageIndex = 1; // Start from second image, as first is used for course
      const processedModules = parsedModules.map(module => {
          const processedLessons = module.lessons.map(lesson => {
              // Find existing lesson image or assign new one if available
              const existingLesson = existingCourse.modules
                  .find(m => m.moduleNumber === module.moduleNumber)
                  ?.lessons.find(l => l.title === lesson.title);

              const lessonImage = imageIndex < uploadedImages.length 
                  ? uploadedImages[imageIndex++] 
                  : (existingLesson?.image || null);

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

      // Update course with new data
      const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          {
              title: title || existingCourse.title,
              description: description || existingCourse.description,
              category: category || existingCourse.category,
              price: price ? Number(price) : existingCourse.price,
              instructor: instructor || existingCourse.instructor,
              image: courseImage,
              modules: processedModules
          },
          { new: true }
      );

      return res.status(200).json({
          success: true,
          message: "Course updated successfully",
          course: updatedCourse
      });

  } catch (error) {
      console.error("Error in updateCourse:", error);
      return res.status(500).json({
          success: false,
          message: "Failed to update course",
          error: error.message
      });
  }
};


// Delete a course by ID
const deleteCourse = async (req, res) => {
  try {
    // Find and delete the course
    const deletedCourse = await Course.findByIdAndDelete(req.params.courseId).exec();

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the course has an associated image
    if (deletedCourse.image && deletedCourse.image.publicId) {
      // Attempt to delete the image from Cloudinary
      try {
        await deleteFromCloudinary(deletedCourse.image.publicId);
      } catch (error) {
        console.error(`Error deleting image ${deletedCourse.image.publicId} from Cloudinary:`, error);
      }
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
  deleteCourse,
  getCoursesByUserId
};
