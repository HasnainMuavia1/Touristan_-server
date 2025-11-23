const Package = require('../models/Package');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Helper function to delete local file
const deleteLocalFile = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  
  // Check if it's a local file path
  if (!fileUrl.startsWith('/uploads/')) return;
  
  try {
    const filePath = path.join(__dirname, '..', fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted local file:', filePath);
    }
  } catch (err) {
    console.error('Error deleting local file:', err);
  }
};

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res, next) => {
  try {
    // Add query parameters for filtering
    const query = { active: true };
    
    // Check if featured filter is applied
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Find packages based on query
    const packages = await Package.find(query);

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
exports.getPackage = async (req, res, next) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return next(
        new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if package is active or user is admin
    // req.user will be set by optionalAuth middleware if token is provided
    const isAdmin = req.user && req.user.role === 'admin';
    console.log('User checking package:', req.user ? `${req.user.email} (${req.user.role})` : 'Unauthenticated');
    console.log('Package active status:', package.active);
    
    if (!package.active && !isAdmin) {
      return next(
        new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create package
    const package = await Package.create(req.body);

    res.status(201).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let package = await Package.findById(req.params.id);

    if (!package) {
      return next(
        new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
      );
    }

    // Update package
    package = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload main package image
// @route   PUT /api/packages/:id/image
// @access  Private/Admin
exports.uploadPackageImage = async (req, res, next) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return next(
        new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if image was uploaded or URL was provided
    if (!req.body.img) {
      return next(new ErrorResponse('Please upload an image or provide an image URL', 400));
    }

    // If package already has an image, delete the old local file
    if (package.img) {
      deleteLocalFile(package.img);
    }

    // Update package with new image
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      { img: req.body.img },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedPackage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload multiple package images
// @route   PUT /api/packages/:id/images
// @access  Private/Admin
exports.uploadPackageImages = async (req, res, next) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return next(
        new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if images were uploaded or URLs were provided
    if (!req.body.images || req.body.images.length === 0) {
      return next(new ErrorResponse('Please upload at least one image or provide image URLs', 400));
    }

    // If package already has images, delete the old local files
    if (package.images && package.images.length > 0) {
      for (const img of package.images) {
        deleteLocalFile(img);
      }
    }

    // Update package with new images
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      { images: req.body.images },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedPackage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Disable package (soft delete)
// @route   PUT /api/packages/:id/disable
// @access  Private/Admin
exports.disablePackage = async (req, res, next) => {
  try {
    let package = await Package.findById(req.params.id);

    if (!package) {
      return next(
        new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
      );
    }

    // Set active to false (soft delete)
    package = await Package.findByIdAndUpdate(
      req.params.id,
      { active: false },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Enable package
// @route   PUT /api/packages/:id/enable
// @access  Private/Admin
exports.enablePackage = async (req, res, next) => {
  try {
    let package = await Package.findById(req.params.id);

    if (!package) {
      return next(
        new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
      );
    }

    // Set active to true
    package = await Package.findByIdAndUpdate(
      req.params.id,
      { active: true },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload temporary image (before package creation)
// @route   POST /api/packages/temp/image
// @access  Private/Admin
exports.uploadTempImage = async (req, res, next) => {
  try {
    // Check if image was uploaded
    if (!req.body.img && !req.file) {
      return next(new ErrorResponse('Please upload an image', 400));
    }

    // Get image URL from either req.body.img (if URL was provided) or req.file.path (if file was uploaded)
    const imageUrl = req.body.img || req.file?.path;

    if (!imageUrl) {
      return next(new ErrorResponse('Failed to get image URL', 400));
    }

    res.status(200).json({
      success: true,
      url: imageUrl,
      data: {
        url: imageUrl
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload temporary images (before package creation)
// @route   POST /api/packages/temp/images
// @access  Private/Admin
exports.uploadTempImages = async (req, res, next) => {
  try {
    // Check if images were uploaded
    if ((!req.body.images || req.body.images.length === 0) && (!req.files || req.files.length === 0)) {
      return next(new ErrorResponse('Please upload at least one image', 400));
    }

    // Get image URLs from either req.body.images (if URLs were provided) or req.files (if files were uploaded)
    const imageUrls = req.body.images || (req.files ? req.files.map(file => file.path) : []);

    if (!imageUrls || imageUrls.length === 0) {
      return next(new ErrorResponse('Failed to get image URLs', 400));
    }

    res.status(200).json({
      success: true,
      urls: imageUrls,
      data: {
        urls: imageUrls
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all packages (including inactive) - Admin only
// @route   GET /api/packages/admin/all
// @access  Private/Admin
exports.getAllPackagesAdmin = async (req, res, next) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    // Get total count for pagination
    const total = await Package.countDocuments();
    
    // Query with pagination
    const packages = await Package.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: packages.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: packages
    });
  } catch (err) {
    next(err);
  }
};
