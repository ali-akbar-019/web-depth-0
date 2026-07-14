const multer = require('multer')
const path = require('path')
const AppError = require('../utils/AppError')

// Storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Folder path
        const folder = req.body.folder || 'general'
        cb(null, `uploads/${folder}`)
    },
    filename: function(req, file, cb) {
        // Unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
    }
})

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(new AppError('Invalid file type. Only images, PDFs, and documents are allowed.', 400))
    }
}

// Upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
})

// Multiple files upload
const uploadMultiple = upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 5 }
])

// Single file upload
const uploadSingle = upload.single('file')

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple
}