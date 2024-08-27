const multer = require("multer")


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })

module.exports = upload