const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

const validateEnvironment = () => {
    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    if (process.env.JWT_SECRET.trim().length < 32) {
        throw new Error("JWT_SECRET must contain at least 32 characters");
    }

    if (/^(replace_with|change_me|your[_-])/i.test(process.env.JWT_SECRET.trim())) {
        throw new Error("Replace the example JWT_SECRET with a unique random secret");
    }

    if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
        throw new Error("CLIENT_ORIGINS must be configured in production");
    }

    const sameSite = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();
    if (!["strict", "lax", "none"].includes(sameSite)) {
        throw new Error("COOKIE_SAME_SITE must be strict, lax, or none");
    }

    if (sameSite === "none" && process.env.NODE_ENV !== "production") {
        throw new Error("COOKIE_SAME_SITE=none requires NODE_ENV=production so cookies use Secure");
    }

    if (process.env.PORT !== undefined) {
        const port = Number(process.env.PORT);
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new Error("PORT must be an integer from 1 to 65535");
        }
    }
};

const allowedOrigins = (
    process.env.CLIENT_ORIGINS ||
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173")
)
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

app.use((req, res) => {
    return res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error.message === "Origin is not allowed by CORS") {
        return res.status(403).json({ message: "Origin is not allowed" });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({ message: "Request body is too large" });
    }

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON request body" });
    }

    console.error("Unhandled request error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
    try {
        validateEnvironment();
        await connectDB();

        const port = process.env.PORT === undefined ? 1198 : Number(process.env.PORT);
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
