
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Rating and Review schema
const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Define the Lesson schema
const LessonSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  image:{publicId : String , url : String } // Could be a URL or a file path
});

// Define the Module schema
const ModuleSchema = new Schema({
  moduleNumber: { type: Number, required: true },
  title: { type: String, required: true },
  lessons: [LessonSchema]
});

// Define the main Course schema
const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students:[{ type: Schema.Types.ObjectId , ref: "User" }],
  image: { publicId : String , url : String }, // Image file path or URL
  modules: [ModuleSchema],
  reviews: [ReviewSchema], // Array of reviews for the course
  averageRating: { type: Number, default: 0 }
},
{
    timestamps: true
})

// Pre-save hook to calculate average rating
CourseSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    this.averageRating =
      this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

// Export the Course model
module.exports = mongoose.model('Course', CourseSchema);

