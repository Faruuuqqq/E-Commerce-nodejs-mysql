const multer = require("multer");
const path = require("path");
const { allowedNodeEnvironmentFlags } = require("process");

// folder path and file name
const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
})

// filter file to JPG, PNG, JPEG
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
      return cb(null, true);
  } else {
      return cb(new Error("Only images are allowed!"));
  }
};

// middleware to upload file
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024},
  fileFilter: fileFilter
});

module.exports = upload;