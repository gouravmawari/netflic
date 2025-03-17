const mongoose = require("mongoose"); 
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



// const Redis = require('ioredis');
// const redis = new Redis(); 

const PORT = process.env.PORT || 8888; 
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
