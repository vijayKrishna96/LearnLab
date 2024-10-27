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

module.exports = { uploadCloudinary }