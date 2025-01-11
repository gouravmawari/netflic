// const JWT = require("jsonwebtoken");
// const jwtSecret = "secretKey";

// const Authentication = (req,res)=>{
//     try{
//         const token = req.headers.authorization.split(" ")[1];
//         if(token){
//             JWT.verify(token,jwtSecret,(err,decodedtoken) => {
//                 if(err){
//                     return res.status(401).json({message:"you are unauthorize"});
//                 }else{
//                     next();
//                 }
//             })
//         }else{
//             return res.status(401).json({message:"token not found"});
//         }
//     }
//     catch(error){
//         return res.stats(500).json({message:"IONTERNAL server error"});
//     }
// };
// module.exports = {Authentication};
const JWT = require("jsonwebtoken");
const jwtSecret = "secretKey";

const Authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Safely access authorization header
        if (token) {
            JWT.verify(token, jwtSecret, (err, decodedtoken) => {
                if (err) {
                    return res.status(401).json({ message: "You are unauthorized" });
                } else {
                    // req.user = decodedtoken; // Pass decoded data for further use
                    next();
                }
            });
        } else {
            return res.status(401).json({ message: "Token not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { Authentication };
