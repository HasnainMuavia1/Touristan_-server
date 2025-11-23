const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const postsDir = path.join(uploadsDir, 'posts');

[uploadsDir, postsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set up local file storage for post images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, postsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomnumber-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allow only image files
  const filetypes = /jpeg|jpg|png|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10000000, // 10MB max file size (increased from 5MB)
    fieldSize: 10 * 1024 * 1024, // 10MB field size limit
    fields: 20 // Allow up to 20 non-file fields
  },
  fileFilter: fileFilter
});

// Middleware for handling post image uploads
exports.uploadPostImage = (req, res, next) => {
  console.log('Starting image upload middleware');
  console.log('Request body before upload:', req.body);
  
  const uploadSingle = upload.single('image');

  // Set a timeout for the multer upload
  const uploadTimeout = setTimeout(() => {
    return next(new ErrorResponse('Image upload timed out. Please try again with a smaller image or check your connection.', 408));
  }, 20000); // 20 seconds timeout

  uploadSingle(req, res, function (err) {
    // Clear the timeout since the upload completed (either success or error)
    clearTimeout(uploadTimeout);
    
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      console.error('Multer error during upload:', err);
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown error during upload:', err);
      return next(new ErrorResponse(`Error: ${err.message}`, 400));
    }
    
    console.log('Request body after upload:', req.body);
    
    // If no file was uploaded, continue without error (post without image)
    if (!req.file) {
      console.log('No file in req.file after upload process');
      return next();
    }
    
    // Add local file URL to request body
    // File is saved in uploads/posts/ directory
    const fileUrl = `/uploads/posts/${req.file.filename}`;
    req.body.image = fileUrl;
    console.log('Image uploaded successfully:', req.file.filename);
    console.log('Image URL:', fileUrl);
    
    // Make sure content field is preserved
    console.log('Content field after upload:', req.body.content);
    
    next();
  });
};
