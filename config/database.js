require('dotenv').config();

const mongoose = require('mongoose')

const connectDB = async () => {

    try{
        await mongoose.connect(process.env.DATABASE)
        console.log("Database Connected")
    }catch{
        console.log('Not connected')
    }
    
}

module.exports  = {
    connectDB
}