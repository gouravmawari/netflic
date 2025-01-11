// const mongoose = require("mongoose"); // Correct import for mongoose
// const express = require("express");
// const app = express();
// const path = require("path");
// const bodyParser = require("body-parser");
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const PORT = process.env.PORT || 8888; // Define PORT at the top for clarity
// app.use("/api",require("./Routes/routes"));
// app.use(bodyParser.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// const dbURI = "mongodb+srv://guddu:guddu@cluster1.ved7bni.mongodb.net/yes?retryWrites=true&w=majority";

// // Connect to MongoDB
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Connected to MongoDB successfully");
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error("Error connecting to MongoDB:", err.message);
//     });

const mongoose = require("mongoose"); // Correct import for mongoose
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/", require("./Routes/routes"));



const Redis = require('ioredis');
const redis = new Redis(); // This connects to Redis on localhost:6379 by default

// Database Connection and Server Setup
const PORT = process.env.PORT || 8888; // Define PORT at the top for clarity
const dbURI = "mongodb+srv://guddu:guddu@cluster1.ved7bni.mongodb.net/yes?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });
