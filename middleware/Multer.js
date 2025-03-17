
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "movies/"); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    },
});


const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mkv|avi/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed!"));
        }
    },
});

module.exports = { upload };
