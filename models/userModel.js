const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Base User schema with the discriminatorKey
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    bio: { type: String, default: '' },
    phone: { type: Number },
    active: { type: Boolean, default: false },
    role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
    headline: { type: String },
    profilePicture: { url: { type: String, default: '' } },
}, { 
    timestamps: true, 
    discriminatorKey: 'role',
    toJSON: { virtuals: true }, // Enable virtuals
    toObject: { virtuals: true } // Enable virtuals
});

// Virtual field for joined date 
userSchema.virtual('joined').get(function() { return this._id.getTimestamp(); });

// Base User model
const User = mongoose.model('User', userSchema);

// Student schema and discriminator
const studentSchema = new mongoose.Schema({
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for course details in students
studentSchema.virtual('courseDetails', {
    ref: 'Course',
    localField: 'courses',
    foreignField: '_id',
});

// Define the Student discriminator
const Student = User.discriminator('student', studentSchema);

// Instructor schema and discriminator
const instructorSchema = new mongoose.Schema({
    expertise: { type: String },
    rating: { type: Number, default: 0 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', match: { role: 'student' } }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for student details in instructors
instructorSchema.virtual('studentDetails', {
    ref: 'User',
    localField: 'students',
    foreignField: '_id',
    justOne: false,
});

// Virtual field for course details in instructors
instructorSchema.virtual('courseDetails', {
    ref: 'Course',
    localField: 'courses',
    foreignField: '_id',
    justOne: false,
});

// Define the Instructor discriminator
const Instructor = User.discriminator('instructor', instructorSchema);

// Admin schema and discriminator
const adminSchema = new mongoose.Schema({}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Define the Admin discriminator
const Admin = User.discriminator('admin', adminSchema);

module.exports = {
    User,
    Student,
    Instructor,
    Admin
};