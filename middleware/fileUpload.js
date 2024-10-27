// const multer = require("multer")

const multer = require("multer")


// const storage = multer.diskStorage({
  
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })

// const upload = multer({ storage: storage })

// module.exports = upload

const storage = multer.diskStorage(
    {
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname)
        }
    }
)

const upload = multer({ storage: storage })

module.exports = { upload }