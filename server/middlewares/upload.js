import multer from "multer";
import path from "path";

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Files will be saved in the 'uploads' folder in your server root
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Create a unique filename: timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File Filter (Accept Images & PDFs)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Error: Only Images (jpeg, jpg, png, webp) and PDFs are allowed!"
      )
    );
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;
