const mongoose = require("mongoose");

const series_schema = new mongoose.Schema({
    Name: { type: String, required: true }, // Correct type and required fields
    episodes: [
        {
            type: mongoose.Schema.Types.ObjectId, // Fixed capitalization
            ref: 'Video_series' // Reference to the Video model (use the model name as a string)
        }
    ],
    Discription: { type: String }, // Fixed optional description field
    season: { type: Number }, // Season as a number
    Director:{type:String},
    Writer:{type:String},
    Lead_Actor:[{type:String}],
    Category:{type:String}
});

const Series_schema = mongoose.model("Series", series_schema); // Updated model name for consistency
module.exports = Series_schema;
