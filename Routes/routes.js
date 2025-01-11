const express = require("express");
const { registerController, upload_movie, epi_series , stream,login,addSubUser } = require("../Controlller/controller");
const Routes = express.Router();
const {Authentication} = require("../middleware/JWT");
const RateLimit = require("../middleware/rate-limit");
const { upload } = require("../middleware/Multer"); // Destructure 'upload' from the middleware module

// Define routes
Routes.post("/register", registerController);
Routes.post("/uploads", upload.single("video"), upload_movie);
Routes.get("/stream/:filename", stream);
Routes.post("/addSubUser",addSubUser);
Routes.get("/login",Authentication,RateLimit,login);
module.exports = Routes;