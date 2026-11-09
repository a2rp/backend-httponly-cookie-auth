const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET, {
                algorithms: ["HS256"],
            });
        } catch {
            return res.status(401).json({ message: "Authentication required" });
        }

        if (!decoded || typeof decoded.userId !== "string" || !mongoose.isValidObjectId(decoded.userId)) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        req.user = user;
        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = protect;
