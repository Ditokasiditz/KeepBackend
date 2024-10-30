// middlewares/errorHandler.js
const multer = require('multer');

const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: 'error',
            message: 'File upload error',
            error: err.message
        });
    }
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
    next(err);
};

module.exports = uploadErrorHandler;