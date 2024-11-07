// const cloudinaryInstance = require('../config/cloudinaryConfig')

const { cloudinaryInstance } = require("../config/cloudinaryConfig")

const uploadCloudinary = async (localFilePath, publicId) => {
    try{
        if(!localFilePath){
            console.log("path is no given")
        }
        const response = await cloudinaryInstance.uploader.upload(localFilePath , {resource_type: 'auto' , public_id: publicId});
        if(response){
            return response
        }
    }catch(error){
        console.log(error.message)
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
      if (!publicId) {
        throw new Error("Public ID is required for deletion");
      }
  
      const response = await cloudinaryInstance.uploader.destroy(publicId, { resource_type: 'image' });
      if (response.result === 'ok') {
        console.log(`File with Public ID: ${publicId} deleted successfully.`);
        return response;
      } else {
        console.log(`Failed to delete file with Public ID: ${publicId}. Response: ${response.result}`);
        return response;
      }
    } catch (error) {
      console.error(`Error deleting file from Cloudinary: ${error.message}`);
      throw error; // Re-throw error for further handling if needed
    }
  };

module.exports = { uploadCloudinary , deleteFromCloudinary }