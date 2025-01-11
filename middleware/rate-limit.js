const rateLimit = require("express-rate-limit");

const RateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: {
        status: 429,
        message: "Too many attempts. Please try again later.",
    },
});

module.exports = RateLimit;
