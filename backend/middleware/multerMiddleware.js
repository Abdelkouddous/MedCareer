import multer from "multer";

const storage = multer.diskStorage({
  // we decide the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Set the destination folder for uploaded files
  },
  // we go first with the file name property
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueFilename = Date.now() + "-" + file.originalname;
    cb(null, uniqueFilename);
  },
});

// invoke multer with the storage option
const upload = multer({ storage });

// export the upload middleware
export default upload;
