const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const packagesDir = path.join(uploadsDir, 'packages');
const profilesDir = path.join(uploadsDir, 'profiles');

[uploadsDir, packagesDir, profilesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set up local file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on field name
    if (file.fieldname === 'profileImage') {
      cb(null, profilesDir);
    } else {
      cb(null, packagesDir);
    }
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
    fieldSize: 10 * 1024 * 1024 // 10MB field size limit
  },
  fileFilter: fileFilter
});

// Middleware for handling package image uploads
exports.uploadPackageImage = (req, res, next) => {
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
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      // An unknown error occurred
      return next(new ErrorResponse(`Error: ${err.message}`, 400));
    }
    
    // If no file was uploaded, continue without error
    if (!req.file) {
      return next();
    }
    
    // Add local file URL to request body
    // File is saved in uploads/packages/ directory
    const fileUrl = `/uploads/packages/${req.file.filename}`;
    req.body.img = fileUrl;
    
    console.log('File uploaded successfully:', req.file.filename);
    
    next();
  });
};

// Middleware for handling multiple package images upload
exports.uploadPackageImages = (req, res, next) => {
  const uploadMultiple = upload.array('images', 10); // Allow up to 10 images

  // Set a timeout for the multer upload
  const uploadTimeout = setTimeout(() => {
    return next(new ErrorResponse('Images upload timed out. Please try again with smaller images or fewer images.', 408));
  }, 30000); // 30 seconds timeout for multiple images

  uploadMultiple(req, res, function (err) {
    // Clear the timeout since the upload completed (either success or error)
    clearTimeout(uploadTimeout);
    
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      // An unknown error occurred
      return next(new ErrorResponse(`Error: ${err.message}`, 400));
    }
    
    // If no files were uploaded, continue without error
    if (!req.files || req.files.length === 0) {
      return next();
    }
    
    // Add local file URLs to request body
    // Files are saved in uploads/packages/ directory
    req.body.images = req.files.map(file => `/uploads/packages/${file.filename}`);
    
    console.log('Files uploaded successfully:', req.files.map(f => f.filename));
    
    next();
  });
};

// Middleware for handling profile image uploads
exports.uploadProfileImage = (req, res, next) => {
  // Create a custom upload instance for profile images
  const profileUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, profilesDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
      }
    }),
    limits: { 
      fileSize: 5000000, // 5MB max file size for profile images
      fieldSize: 5 * 1024 * 1024 // 5MB field size limit
    },
    fileFilter: fileFilter
  });

  const uploadSingle = profileUpload.single('profileImage');

  // Set a timeout for the multer upload
  const uploadTimeout = setTimeout(() => {
    return next(new ErrorResponse('Profile image upload timed out. Please try again with a smaller image or check your connection.', 408));
  }, 20000); // 20 seconds timeout

  uploadSingle(req, res, function (err) {
    // Clear the timeout since the upload completed (either success or error)
    clearTimeout(uploadTimeout);
    
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      return next(new ErrorResponse(`Upload error: ${err.message}`, 400));
    } else if (err) {
      // An unknown error occurred
      return next(new ErrorResponse(`Error: ${err.message}`, 400));
    }
    
    // If no file was uploaded, return an error
    if (!req.file) {
      return next(new ErrorResponse('Please upload a profile image', 400));
    }
    
    // Add local file URL to request body
    const fileUrl = `/uploads/profiles/${req.file.filename}`;
    req.body.profileImage = fileUrl;
    
    console.log('Profile image uploaded successfully:', req.file.filename);
    
    next();
  });
};
