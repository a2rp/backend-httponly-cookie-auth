const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

const validateEnvironment = () => {
    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    if (process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET must contain at least 32 characters");
    }
};

const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin is not allowed by CORS"));
        },
        credentials: true,
    }),
);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many authentication requests. Try again later." },
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "HttpOnly Cookie Auth API is running",
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        database: "configured",
    });
});

app.use("/api/auth", authLimiter, authRoutes);

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error.message === "Origin is not allowed by CORS") {
        return res.status(403).json({ message: "Origin is not allowed" });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({ message: "Request body is too large" });
    }

    console.error("Unhandled request error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
    try {
        validateEnvironment();
        await connectDB();

        const port = Number(process.env.PORT) || 1198;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error(`Server startup failed: ${error.message}`);
        process.exitCode = 1;
    }
};

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer, validateEnvironment };
