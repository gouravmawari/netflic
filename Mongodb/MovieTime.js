const mongoose = require("mongoose");
const Movietime = new mongoose.Schema({
    SubUser_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubUser_schema"
    },
    video_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    TimeStamp:{
       type:String
    }
})
const movietime = mongoose.Schema("Movietime",Movietime);
module.exports = movietime