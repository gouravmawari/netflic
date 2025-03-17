const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    Name:{type:String},
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    Discription:{type:String},
    Director:{type:String},
    Writer:{type:String},
    IMDB:{type:Number},
    Lead_Actor:[{type:String}],
    Category:{type:String}
});

module.exports = mongoose.model("Video", videoSchema);
