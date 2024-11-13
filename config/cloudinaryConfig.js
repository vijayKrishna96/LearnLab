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


