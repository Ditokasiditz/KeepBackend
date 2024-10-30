// middlewares/imgurMiddleware.js
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Configure multer upload settings
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Middleware to upload to Imgur
const uploadToImgur = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer.toString('base64'));

        const response = await axios.post('https://api.imgur.com/3/image', formData, {
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                ...formData.getHeaders()
            }
        });

        req.imageUrl = response.data.data.link;
        next();
    } catch (error) {
        console.error('Error uploading to Imgur:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error uploading image',
            error: error.message
        });
    }
};

module.exports = { upload, uploadToImgur };