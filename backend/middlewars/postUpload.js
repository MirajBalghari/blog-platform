const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {  
        cb(null, 'uploads/posts');
    },
    filename: (req, file, cb) => {  
        cb(null,Date.now() + path.extname(file.originalname)); 
    }
});

const postUpload = multer({ storage: storage });

module.exports = postUpload;
