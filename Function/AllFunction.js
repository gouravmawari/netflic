const mongoose = require("mongoose");
const User_schema = require("../Mongodb/Basic");
const PayMent_schema = require("../Mongodb/PayMent");
const Video_schema = require("../Mongodb/Video");
const Series_schema = require("../Mongodb/Series");
const series_videos =require("../Mongodb/SeriesVideo");
const path = require("path");
const seriestime_schema = require("../Mongodb/SeriesTime");
const movietime_schema = require("../Mongodb/MovieTime");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const subUser_schema = require("../Mongodb/SubUser");
const jwtSecret = "secretKey";
const createToken = (id) => {
    return JWT.sign({ id }, jwtSecret, { expiresIn: "1d" }); // Token with 1-day expiration
};
const fs = require("fs");
/**
 * @param {string} Name 
 * @param {string} Email 
 * @param {string} Password 
 * @param {string} Cardholder_Name 
 * @param {Number} Card_number 
 * @param {Number} Expiry_date 
 * @param {Number} CVV 
 * @param {Number} PhoneNumber 
 * @param {string} userId 
 * @returns {Promise<{status: number, data: object}>}
 */



const RegisterUser = async (Name, Email, Password,PhoneNumber) => {
    try {

        const existingUser = await User_schema.findOne({ Email });
        if (existingUser) {
            return {
                status: 403,
                data: { message: "User is already signed up. Redirect to login page." }
            };
        }

        const PAssword = await bcrypt.hash(Password,10);
        const newUser = new User_schema({ Name, Email,Password: PAssword, PhoneNumber });
        const savedUser = await newUser.save();

        return {
            status: 200,
            data: { UserID: savedUser._id }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};



const PayMent = async (userId, Cardholder_Name, Card_number, Expiry_date, CVV) => {
    try {

        const paymentInfo = new PayMent_schema({
            Cardholder_Name,
            Card_number,
            Expiry_date,
            CVV,
            UserId: userId,
        });

        const savedPayment = await paymentInfo.save();


        await User_schema.findByIdAndUpdate(userId, { Payment: savedPayment._id });

        return {
            status: 200,
            data: {
                message: "User payment data has been saved",
                paymentId: savedPayment._id,
            },
        };
    } catch (error) {
        throw new Error(error.message);
    }
};




const series = async (name,Discription,season)=>{
    try{
        const already = await Series_schema.findOne({name});
        if(already){
            return {
                status: 503,
                data:{message:"same series name already exist"}
            }
        }
        const prefix = "series_";
        const uniqueId = new mongoose.Types.ObjectId();
        const customId = `${prefix}${uniqueId}`;
        const Save =  new Series_schema({_id:customId,Name:name,Discription,season});
        const id = await Save.save();
        return {
            status:200,
            data:{
                message:"series added successfully",
                id
            }
        }
    }catch(error){
        throw new Error(error.mesasge);
    }
}



const Upload_movie = async (Name,filename, filePath, size, Discription) => {
    try {
        const video = new Video_schema({ Name,filename, path: filePath, size, Discription });
        console.log("hello babu yp;oad");
        await video.save();
        return {
            status: 201,
            data: {
                message: "Video uploaded successfully",
                video,
            },
        };
    } catch (error) {
        throw new Error(error.message);
    }
};



const add_to_series = async(filename,filePath,size,Discription,series_name) => {
    try{
        const series_id  = await Series_schema.findOne(series_name);
        if(!series_id){
            return {
                status:401,
                data:{
                    message:"wrong series name",
                },
            };
        }
        const video = new series_videos({filename,path:filePath,size,Discription,series:series_id});
        await video.save();
        return {
            status:201,
            data:{
                message:"video uploaded successfully",
                video,
            },
        };
    }catch(error){
        throw new Error(error.message);
    }
}



const Login = async (Email, Password) => {
    try {
        console.log("call login")
        const User = await User_schema.findOne({ Email });
        
        if (!User) {
            return {
                status: 404,
                data: {
                    message: "User not found. Email is not registered.",
                },
            };
        }
        const isPasswordValid = await bcrypt.compare(Password, User.Password);
        if (!isPasswordValid) {
            return {
                status: 401,
                data: {
                    message: "Password is incorrect.",
                },
            };
        }

        const token = createToken(User._id);

        return {
            status: 200,
            data: {
                message: "You have logged in successfully.",
                User_id: User._id,
                token, 
            },
        };
    } catch (error) {
        return {
            status: 500,
            data: {
                message: error.message || "Internal server error.",
            },
        };
    }
};



const Add_subUser = async (User_id, Name) => {
    try {
        const subUser = new subUser_schema({ Name, ParentId: User_id });
        const savedSubUser = await subUser.save();
        await User_schema.findByIdAndUpdate(
            User_id,
            { $push: { SubUser_Id: savedSubUser._id } }, 
            { new: true, useFindAndModify: false } 
        );
        return {
            status: 200,
            data:{
                message: "Sub-user added successfully",
                subUserId: savedSubUser._id,
            }
        };
    } catch (err) {
        console.error(err.message);
        return {
            status: 500,
            message: "Failed to add sub-user",
        };
    }
};





const generateFeatureVector = (item) => {

    const combinedText = `
        ${item.Name || ""} 
        ${item.Discription || ""} 
        ${item.Director || ""} 
        ${item.Writer || ""} 
        ${item.Lead_Actor.join(" ") || ""} 
        ${item.Category || ""}
    `;
    const tokens = combinedText.toLowerCase().split(/\W+/); 
    const uniqueTokens = Array.from(new Set(tokens));
    const tokenMap = {};
    uniqueTokens.forEach((token, index) => {
        tokenMap[token] = index;
    });


    const vector = new Array(uniqueTokens.length).fill(0);
    tokens.forEach((token) => {
        if (tokenMap[token] !== undefined) {
            vector[tokenMap[token]] = 1;
        }
    });

    return vector;
};


const cosineSimilarity = (vectorA, vectorB) => {
    const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val ** 2, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

const recommendVideos = async (watchedItems, allItems) => {
    const watchedVectors = watchedItems.map(generateFeatureVector);
    const allVectors = allItems.map(generateFeatureVector);

    // Compute similarity scores for all items
    const recommendations = allItems.map((item, index) => {
        const similarities = watchedVectors.map((watchedVector) =>
            cosineSimilarity(watchedVector, allVectors[index])
        );
        return {
            item,
            similarity: Math.max(...similarities),
        };
    });

    return recommendations
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)
        .map((rec) => rec.item);
};




const Resume_playBack = async (SubUser_id, Video_id, timestamp) => {
    try {
        let schema, refType;

        if (Video_id.slice(0, 7) === "series_") {
            schema = seriestime_schema;
            refType = "Seriestime";
        } else {
            schema = movietime_schema;
            refType = "Movietime";
        }

        const create = new schema({ SubUser_id, video_id: Video_id, TimeStamp: timestamp });
        const timeID = await create.save();

        await subUser_schema.findByIdAndUpdate(
            SubUser_id,
            { $push: { Saved: timeID, SavedType: refType } },
            { new: true }
        );

        return {
            status: 200,
            data: {
                message: "Resume playback time is saved."
            }
        };
    } catch (err) {
        console.error(err.message);
        return {
            status: 500,
            message: "An error occurred while saving resume playback data."
        };
    }
};


const Recommend = async(SubUser_id)=>{
    try{

        const subUser = await subUser_schema.findById(SubUser_id).populate("Saved");
        const watchedSeries = await seriestime_schema.find({ SubUser_id: SubUser_id }).populate("video_id");
        const watchedMovies = await movietime_schema.find({ SubUser_id: SubUser_id }).populate("video_id");
        const watchedItems = [...watchedSeries.map((s) => s.video_id), ...watchedMovies.map((m) => m.video_id)];

        const allVideos = await Video_schema.find();
        const allSeries = await Series_schema.find();
        const allItems = [...allVideos, ...allSeries];
        const recommendations = await recommendVideos(watchedItems, allItems);

        return {
            status:200,
            data:{
                recommendations 
            }
        }
    }catch(err){
        console.log(err.message);
        return {
            status: 500,
            message:"error in recommendation"
        }
    }
}





module.exports = { RegisterUser , PayMent , Upload_movie , series , add_to_series , Login , Add_subUser , Resume_playBack , Recommend};
