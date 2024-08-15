const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the base User schema with the discriminatorKey
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
    profilePicture: { url: { type: String, default: '' }},
}, { timestamps: true, discriminatorKey: 'role' });

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        console.error('Error hashing the password:', err);
        next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create the base User model
const User = mongoose.model('User', userSchema);

// Define the Student schema and discriminator
const studentSchema = new mongoose.Schema({
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const Student = User.discriminator('student', studentSchema);

// Define the Instructor schema and discriminator
const instructorSchema = new mongoose.Schema({
    bio: { type: String, default: '' },
    expertise: [{ type: String }],
    rating: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const Instructor = User.discriminator('instructor', instructorSchema);

// Define the Admin schema and discriminator
const adminSchema = new mongoose.Schema({
    // Add any admin-specific fields if needed
});

const Admin = User.discriminator('admin', adminSchema);

module.exports = {
    User,
    Student,
    Instructor,
    Admin
};
