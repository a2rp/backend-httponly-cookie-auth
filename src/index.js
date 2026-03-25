const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

dotenv.config();

connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

// test route
app.get("/", (req, res) => {
    res.json({
        message: "HttpOnly Cookie Auth API is running",
    });
});

// auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 1198;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
