const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//  base User schema with the discriminatorKey
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    active: {type: Boolean , default: false},
    role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
    profilePicture: { url: { type: String, default: '' }},
}, { timestamps: true, discriminatorKey: 'role' });

//  base User model
const User = mongoose.model('User', userSchema);

//  Student schema and discriminator
const studentSchema = new mongoose.Schema({
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const Student = User.discriminator('student', studentSchema);

//  Instructor schema and discriminator
const instructorSchema = new mongoose.Schema({
    bio: { type: String, default: '' },
    expertise: [{ type: String }],
    rating: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const Instructor = User.discriminator('instructor', instructorSchema);

//  Admin schema and discriminator
const adminSchema = new mongoose.Schema({
    // Add any admin-specific fields 
});

const Admin = User.discriminator('admin', adminSchema);

module.exports = {
    User,
    Student,
    Instructor,
    Admin
};
