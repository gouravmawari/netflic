const { RegisterUser, PayMent, Upload_movie, series: seriesFn, add_to_series , Stream , Login , Add_subUser } = require("../Function/AllFunction");
const Video_schema = require("../Mongodb/Video");


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


const payment = async (req, res) => {
    const { userId } = req.params; 
    const { Cardholder_Name,  Card_number, Expiry_date, CVV } = req.body;

    try {
        const response = await PayMent(userId, Cardholder_Name, Card_number, Expiry_date, CVV);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in payment:", err.message);
        return res.status(500).json({ error: err.message });
    }
};


const upload_movie = async (req, res) => {
    const { filename, path: filePath, size } = req.file; 
    const { Discription,Name } = req.body;

    try {
        const response = await Upload_movie(Name,filename, filePath, size, Discription);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in upload_movie:", err.message);
        return res.status(500).json({ error: err.message });
    }
};

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




// const path = require("path");
// const fs = require("fs");
// const Video_schema = require("../Mongodb/Video");
// const Redis = require('ioredis');
// const redis = new Redis();

const Redis = require("ioredis");
const redis = new Redis();
const fs = require('fs');
const path = require('path');


const stream = async (req, res) => {
    const { filename, subUserId } = req.params; // Get subUserId from params
    const { userId } = req.user; // Get main account ID from JWT

    console.log("Main User ID:", userId);
    console.log("Sub User ID:", subUserId); // Assuming the sub-user ID is available in the request

    try {
        // Find the video by filename
        const video = await Video_schema.findOne({ Name: filename });
        if (!video || !video.filename) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Check if the sub-user is already streaming
        // const isStreaming = await redis.get(`subuser:${subUserId}:activeStream`);
        // if (isStreaming) {
        //     return res.status(429).json({ message: "You can only stream on one device at a time" });
        // }

        // // Set the sub-user as actively streaming in Redis
        // await redis.set(`subuser:${subUserId}:activeStream`, 1, 'EX', 3600); // 1-hour TTL
        const activeStreams = await redis.keys(`streaming:${userId}:*`);
        
        if (activeStreams.length >= 2) { // More than 1 sub-user streaming? Block it.
            return res.status(429).json({ message: "Only one sub-user can stream at a time!" });
        }

        // ✅ Allow this sub-user to stream & store in Redis
        await redis.set(`streaming:${userId}:${subUserId}`, "active", "EX", 3600);


        const filePath = path.join(__dirname, "../movies", video.filename);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error("File not found:", err);
                return res.status(404).send("Video file not found");
            }

            const range = req.headers.range;
            if (!range) {
                return res.status(416).send("Range header required");
            }

            const videoSize = stats.size;
            const CHUNK_SIZE = 10 ** 6; // 1 MB
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
            videoStream.pipe(res);

            // When the stream ends, clear the Redis key
            videoStream.on('end', () => {
                redis.del(`subuser:${subUserId}:activeStream`);
            });

            // If there's an error, clear the Redis key
            videoStream.on('error', (err) => {
                console.error("Stream error:", err);
                redis.del(`subuser:${subUserId}:activeStream`);
            });
        });
    } catch (err) {
        console.error("Something went wrong with stream:", err.message);
        return res.status(500).json({ error: err.message });
    }
};




// const stream = async (req, res) => {
//     const { filename } = req.params; 
//     try {
//         const video = await Video_schema.findOne({ Name: filename }); 
//         if (!video || !video.filename) {
//             return res.status(404).json({ message: "Video not found" });
//         }

//         const filePath = path.join(__dirname, "../movies", video.filename);
//         fs.stat(filePath, (err, stats) => {
//             if (err) {
//                 console.error("File not found:", err);
//                 return res.status(404).send("Video file not found");
//             }

//             const range = req.headers.range; 
//             if (!range) {
//                 return res.status(416).send("Range header required");
//             }

//             const videoSize = stats.size;
//             const CHUNK_SIZE = 10 ** 6;
//             const start = Number(range.replace(/\D/g, ""));
//             const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//             const headers = {
//                 "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//                 "Accept-Ranges": "bytes",
//                 "Content-Length": end - start + 1,
//                 "Content-Type": "video/mp4",
//             };

//             res.writeHead(206, headers);

//             const videoStream = fs.createReadStream(filePath, { start, end });
//             videoStream.pipe(res);
//         });
//     } catch (err) {
//         console.error("Something went wrong with stream:", err.message);
//         return res.status(500).json({ error: err.message });
//     }
// };



const epi_series = async (req, res) => {
    const { filename, path: filePath, size } = req.file; 
    const { Discription, series_name } = req.body;

    try {
        const response = await add_to_series(filename, filePath, size, Discription, series_name);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error("Error in epi_series:", err.message);
        return res.status(500).json({ error: err.message });
    }
};



const login = async (req, res) => {
    const { Password, Email } = req.body;

    try {

        if (!Password || !Email) {
            return res.status(400).json({ message: "Email and Password are required." });
        }

        const response = await Login(Email, Password);
        return res.status(response.status).json(response.data);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const addSubUser = async(req,res) =>{
    const{User_id,Name} = req.body;
    try{
        console.log(User_id,Name);
        if(!User_id || !Name){
            return res.status(401).json({message:"User_id and Name not given"});
        }
         const response = await Add_subUser(User_id,Name);
        return res.status(response.status).json(response.data);
        
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
