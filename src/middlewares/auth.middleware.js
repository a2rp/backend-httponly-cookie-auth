const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication required" });
    }
};

module.exports = protect;
