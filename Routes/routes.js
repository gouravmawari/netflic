const express = require("express");
const { registerController, upload_movie, epi_series , stream,login,addSubUser } = require("../Controlller/controller");
const Routes = express.Router();
const {Authentication} = require("../middleware/JWT");
const RateLimit = require("../middleware/rate-limit");
const { upload } = require("../middleware/Multer"); 


Routes.post("/register", registerController);
Routes.post("/uploads", upload.single("video"), upload_movie);
Routes.get("/stream/:filename/:subUserId",Authentication,stream);
Routes.post("/addSubUser",addSubUser);
Routes.post("/login",RateLimit,login);
module.exports = Routes;