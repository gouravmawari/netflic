const { RegisterUser, PayMent, Upload_movie, series: seriesFn, add_to_series , Stream , Login , Add_subUser } = require("../Function/AllFunction");
const Video_schema = require("../Mongodb/Video");
// Register Controller
const registerController = async (req, res) => {
    const { Name, Email, Password, PhoneNumber } = req.body;

    console.log("Calling register API");
    try {
        const response = await RegisterUser(Name, Email, Password, PhoneNumber);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in registerController:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

// Payment Controller
const payment = async (req, res) => {
    const { userId } = req.params; // Extract userId from URL
    const { Cardholder_Name, Card_number, Expiry_date, CVV } = req.body;

    try {
        const response = await PayMent(userId, Cardholder_Name, Card_number, Expiry_date, CVV);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in payment:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

// Upload Movie Controller
const upload_movie = async (req, res) => {
    const { filename, path: filePath, size } = req.file; // File details from multer
    const { Discription,Name } = req.body;

    try {
        const response = await Upload_movie(Name,filename, filePath, size, Discription);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in upload_movie:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

// Series Controller
const series = async (req, res) => {
    const { name, Discription, season } = req.body;

    try {
        const response = await seriesFn(name, Discription, season);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in series:", err.message);
        return res.status(500).json({ error: err.message });
    }
};




const path = require("path");
const fs = require("fs");

const stream = async (req, res) => {
    const { filename } = req.params; // Extract filename from params
    try {
        const video = await Video_schema.findOne({ Name: filename }); // Match the field name
        if (!video || !video.filename) {
            return res.status(404).json({ message: "Video not found" });
        }

        const filePath = path.join(__dirname, "../movies", video.filename);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error("File not found:", err);
                return res.status(404).send("Video file not found");
            }

            const range = req.headers.range; // Extract range from headers
            if (!range) {
                return res.status(416).send("Range header required");
            }

            const videoSize = stats.size;
            const CHUNK_SIZE = 10 ** 6; // 1MB
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": "video/mp4",
            };

            res.writeHead(206, headers);

            const videoStream = fs.createReadStream(filePath, { start, end });
            videoStream.pipe(res); // Stream the video to the client
        });
    } catch (err) {
        console.error("Something went wrong with stream:", err.message);
        return res.status(500).json({ error: err.message });
    }
};


// Add to Series Controller
const epi_series = async (req, res) => {
    const { filename, path: filePath, size } = req.file; // File details from multer
    const { Discription, series_name } = req.body;

    try {
        const response = await add_to_series(filename, filePath, size, Discription, series_name);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in epi_series:", err.message);
        return res.status(500).json({ error: err.message });
    }
};


// const login = async(req,res)=>{
//     const {Password,Email} = req.body;
//     try{
//         if(!Password & !Email){
//             return res.status(402).json({"Email or Password is not given"});
//         }
//         const response = await Login(Email,Password);
//         return res.status(response.status).json(response.message);
//     }catch(err){
//         console.log(err.message);
//         return res.statuus(500).json(err.message);
//     }
    

// }

const login = async (req, res) => {
    const { Password, Email } = req.body;

    try {
        // Validate input
        if (!Password || !Email) {
            return res.status(400).json({ message: "Email and Password are required." });
        }

        // Call the Login function to handle the business logic
        const response = await Login(Email, Password);

        // Handle response
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const addSubUser = async(req,res) =>{
    const{User_id,Name} = req.body;
    try{
        if(User_id & Name ){
            const response = await Add_subUser(User_id,Name);
            return res.status(response.status).json(response.data);
        }else{
            return res.status(401).json({message:"User_id and Name not given"});
        }
    }catch(err){
        console.error(err.message);
        return res.status(500).json({message:"Internal server error"})
    }
}

module.exports = {
    registerController,
    payment,
    upload_movie,
    series,
    epi_series,
    stream,
    login,
    addSubUser
};
