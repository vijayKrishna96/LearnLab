const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const { generateUserToken } = require('../utils/generateToken');
const { uploadCloudinary } = require('../utils/uploadCloudinary');

const JWT_SECRET = process.env.JWT_SECRET;

const getAllUsers = async (req, res) => {
  try {
    const students = await User.Student.find({});
    const instructors = await User.Instructor.find({});
    const admins = await User.Admin.find({});

    const users = [...students, ...instructors, ...admins];
    res.json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const student = await User.Student.findById(req.params.userId).select('name profilePicture  courses email phone bio headline expertise students').exec();
    const instructor = await User.Instructor.findById(req.params.userId).select('name profilePicture  courses email phone headline bio expertise students').exec();
    const admin = await User.Admin.findById(req.params.userId).select('name profilePicture email phone').exec();
    const userById = [student, instructor, admin].filter(
      (user) => user !== null
    );

    if (userById.length === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(userById);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUsersById = async (req, res) => {
  try {
    // Fetch student details
    const student = await User.Student.findById(req.params.userId)
      .select('-password')
      .exec();

    // Fetch instructor details with populated student fields (name, email, phone)
    const instructor = await User.Instructor.findById(req.params.userId)
      .select('-password')
      .populate({
        path: 'students',
        select: 'name email phone' // Only fetch these fields for each student
      })
      .exec();

    // Fetch admin details
    const admin = await User.Admin.findById(req.params.userId)
      .select('name profilePicture email phone')
      .exec();

    // Filter to only include found users
    const userById = [student, instructor, admin].filter(
      (user) => user !== null
    );

    if (userById.length === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(userById);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, profilePicture } = req.body;

    const existingUser =
      (await User.Student.findOne({ email })) ||
      (await User.Instructor.findOne({ email })) ||
      (await User.Admin.findOne({ email }));
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      let user;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      if (role === "student") {
        user = new User.Student({
          name,
          email,
          password: hashedPassword,
          profilePicture,
          active: true
        });
      } else if (role === "instructor") {
        const { bio, expertise } = req.body;
        user = new User.Instructor({
          name,
          email,
          password: hashedPassword,
          bio,
          expertise,
          profilePicture,
          active: true
        });
      } else if (role === "admin") {
        user = new User.Admin({
          name,
          email,
          password: hashedPassword,
          profilePicture,
          active: true
        });
      } else {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      await user.save();

      const token = generateUserToken(email, role);

      res
        .status(201)
        .json({ message: `${role} registered successfully`, user , success: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
 
    let updateOperations = { ...req.body };

    // Check if an image file is included in the request
    if (req.file) {
      // Upload image to Cloudinary
      const cloudinaryResponse = await uploadCloudinary(req.file.path, `userImages/${req.params.userId}`);

      if (cloudinaryResponse) {
        // Add the Cloudinary image URL to the updatedData object
        updateOperations.profilePicture = { url: cloudinaryResponse.url };
      }
    }

    // Ensure courses are appended properly
    if (req.body.courses || req.body.students) {
      updateOperations.$addToSet = {};

      // Add courses if provided
      if (req.body.courses) {
        updateOperations.$addToSet.courses = { $each: Array.isArray(req.body.courses) ? req.body.courses : [req.body.courses] };
        delete updateOperations.courses; // Prevent conflict
      }

      // Add students if provided
      if (req.body.students) {
        updateOperations.$addToSet.students = { $each: Array.isArray(req.body.students) ? req.body.students : [req.body.students] };
        delete updateOperations.students; // Prevent conflict
      }
    }
    // Try updating each user type and filter out any null results
    const [updatedStudent, updatedInstructor, updatedAdmin] = await Promise.all(
      [
        User.Student.findByIdAndUpdate(req.params.userId, updateOperations, {
          new: true,
          runValidators: true,
        }).exec(),
        User.Instructor.findByIdAndUpdate(req.params.userId, updateOperations, {
          new: true,
          runValidators: true,
        }).exec(),
        User.Admin.findByIdAndUpdate(req.params.userId, updateOperations, {
          new: true,
          runValidators: true,
        }).exec(),
      ]
    );

    // Filter to find the updated user, if any
    const updatedUser = [updatedStudent, updatedInstructor, updatedAdmin].find((user) => user !== null);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

const updateInstructor = async (req, res) => {
  try {
    // console.log(req.body); // The request body is now { students: [ '6714c3f317f165436c5361c8' ] }

    let updatedData = { ...req.body };

    // Check if an image file is included in the request
    if (req.file) {
      // Upload image to Cloudinary
      const cloudinaryResponse = await uploadCloudinary(req.file.path, `instructorImages/${req.params.userId}`);

      if (cloudinaryResponse) {
        // Add the Cloudinary image URL to the updatedData object
        updatedData.profilePicture = { url: cloudinaryResponse.url };
      }
    }

    // Update the instructor with the given ID
    const updatedInstructor = await User.Instructor.findByIdAndUpdate(
      req.params.userId,
      {
        $addToSet: { students: { $each: [req.body.students[0]], $ne: req.body.students[0] } },
      },
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    if (!updatedInstructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json({ message: "Instructor updated successfully", updatedInstructor });
  } catch (error) {
    res.status(500).json({ message: "Error updating instructor", error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;

    // //validate Id
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid user ID" });
    // }

    let user =
      (await User.Student.findByIdAndDelete(id)) ||
      (await User.Instructor.findByIdAndDelete(id)) ||
      (await User.Admin.findByIdAndDelete(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};


const userProfile = async (req, res, next) => {

  try {

    const user = req.user
    
    let useData;

    if (user.role === "student") {
      useData = await User.Student.findOne({ email: user.email }).select("-password").exec();
    } else if (user.role === "instructor") {
      useData = await User.Instructor.findOne({ email: user.email }).select("-password").exec();
    } else if (user.role === "admin") {
      useData = await User.Admin.findOne({ email: user.email }).select("-password").exec();
    } else {
      return res.status(400).json({ success: false, message: "Invalid user role" });
    }

    if (!useData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User data fetched", data: useData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }

};

const checkUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const roles = ['admin', 'student', 'instructor'];

    if (roles.includes(user.role)) {
      return res.json({
        success: true,
        message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} authenticated`,
        role: user.role,  // Include the role
        userId: user.userId  // Include the userId
      });
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized role" });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};


module.exports = {
  getAllUsers,
  getUsersById,
  registerUser,
  updateUser,
  deleteUser,
  checkUser,
  userProfile,
  getUserById,
  updateInstructor,

};
