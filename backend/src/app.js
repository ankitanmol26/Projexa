import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import projectRoutes from "./routes/projectRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ==============================
// Global Middlewares
// ==============================

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Compress responses
app.use(compression());

// HTTP request logger
app.use(morgan("dev"));
app.use("/api/v1/projects", projectRoutes);

// ==============================
// Health Check Route
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Projexa Backend API",
  });
});

// ==============================
// API Routes
// ==============================

app.use("/api/v1/auth", authRoutes);

// ==============================
// Error Handling
// ==============================

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;