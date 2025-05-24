const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `Image-${Date.now()}-${file.originalname}`)
    }
})

const profileUpload = multer({ storage: storage })

module.exports = profileUpload