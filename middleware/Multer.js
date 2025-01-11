
const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "movies/"); // Store files in "movies" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
    },
});

// Multer upload configuration
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mkv|avi/; // Allowed file types
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed!"));
        }
    },
});

module.exports = { upload };
