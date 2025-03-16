const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder 'uploads/' ada
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi tempat penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Simpan di folder uploads/
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter untuk membatasi jenis file (hanya JPG, PNG, JPEG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

// Middleware Multer untuk upload file
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter: fileFilter
});

module.exports = upload;