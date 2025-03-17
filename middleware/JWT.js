
// const JWT = require("jsonwebtoken");
// const jwtSecret = "secretKey";

// const Authentication = (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//         if (token) {
//             JWT.verify(token, jwtSecret, (err, decodedtoken) => {
//                 if (err) {
//                     return res.status(401).json({ message: "You are unauthorized" });
//                 } else {
                    
//                     next();
//                 }
//             });
//         } else {
//             return res.status(401).json({ message: "Token not found" });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// module.exports = { Authentication };
// const { Netflic_User_data, subUser } = require("../Mongodb/"); // Import your models
// const Netflic_User_data = require("../Mongodb/Basic");
// const JWT = require("jsonwebtoken");
// const jwtSecret = "secretKey";

// const User_schema = require("../Mongodb/Basic");
// const subUser = require("../Mongodb/SubUser");
// const Authentication = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({ message: "Token not found" });
//         }

//         // Verify the token
//         JWT.verify(token, jwtSecret, async (err, decodedToken) => {
//             if (err) {
//                 return res.status(401).json({ message: "You are unauthorized" });
//             }

//             // Fetch the user from the database
//             console.log(decodedToken);
//             console.log(decodedToken.id);
//             const user = await User_schema.findById(decodedToken.id)
//             console.log(user);
//             if (!user) {
//                 return res.status(401).json({ message: "User not found" });
//             }

//             // Attach user and sub-user information to the request
//             req.user = {
//                 userId: user._id,
//                 subUserId: user.SubUser_Id[0]._id, // Assuming the first sub-user is the active one
//             };

//             next();
//         });
//     } catch (error) {
//         console.error("Authentication error:", error.message);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// module.exports = { Authentication };
const JWT = require("jsonwebtoken");
const User_schema = require("../Mongodb/Basic");
const subUser = require("../Mongodb/SubUser");

const jwtSecret = process.env.JWT_SECRET || "secretKey"; // Store in env

const Authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        // Verify the token
        JWT.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: "You are unauthorized" });
            }

            try {
                // console.log(decodedToken.id);
                const user = await User_schema.findById(decodedToken.id).populate("SubUser_Id");
               
                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }
                console.log(user.id);

                // // Check if the user has sub-users
                // const subUserId = user.SubUser_Id?.length > 0 ? user.SubUser_Id[0]._id : null;

                req.user = {
                    userId: user.id,
                     // Could be null if no sub-users
                };

                next();
            } catch (error) {
                console.error("Error fetching user:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { Authentication };
