const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv")


dotenv.config();
// console.log('name',process.env.CLOUD_API_SECRET)
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  })

const cloudinaryInstance = cloudinary

module.exports = {cloudinaryInstance}

// // cloudinary.config({
// //     cloud_name: process.env.CLOUD_NAME,
// //     api_key: process.env.CLOUD_API_KEY,
// //     api_secret: process.env.CLOUD_API_SECRET,
// // });

// // const cloudinaryInstance = cloudinary;

// // module.exports = cloudinaryInstance;
// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// // Multer-Cloudinary storage configuration
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "courses", // Folder in Cloudinary where files are stored
//     resource_type: "auto", // Automatically determine file type (image, video, etc.)
//     allowed_formats: ["jpg", "png", "mp4", "pdf"], // Specify allowed file types
//   },
// });

// const upload = multer({ storage });

// module.exports = { upload };



