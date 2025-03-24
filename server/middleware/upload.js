const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a more descriptive filename
    const timestamp = Date.now();
    const originalName = path.parse(file.originalname).name;
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, "-");
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${sanitizedName}-${timestamp}${extension}`);
  }
});

// Enhanced file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPG, JPEG, PNG, WEBP) are allowed!"), false);
  }
};

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB."
      });
    }
    return res.status(400).json({
      success: false,
      message: "File upload error: " + err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Image optimization middleware
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const optimizedPath = path.join(
      uploadDir,
      `optimized-${path.basename(req.file.filename)}`
    );

    await sharp(req.file.path)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    // Delete original file
    fs.unlinkSync(req.file.path);

    // Update file info
    req.file.filename = `optimized-${path.basename(req.file.filename)}`;
    req.file.path = optimizedPath;
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    next(error);
  }
};

// Cleanup old files middleware
const cleanupOldFiles = async (req, res, next) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      
      // Delete files older than 1 day that aren't being used
      if (now - stats.mtime.getTime() > oneDay) {
        fs.unlinkSync(filePath);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Only one file at a time
  },
  fileFilter: fileFilter
});

module.exports = {
  upload,
  handleUploadError,
  optimizeImage,
  cleanupOldFiles
};