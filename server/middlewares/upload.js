import multer from "multer";
import path from "path";

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Files will be saved in the 'uploads' folder in server root
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Create a unique filename: timestamp + random suffix + extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter (Accept Images & PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Error: Only Images (JPEG, JPG, PNG, WEBP) and PDF files are allowed!"
      )
    );
  }
};

// Initialize Multer with 20MB Limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB limit per file
    files: 5,
  },
});

export default upload;
