import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";


const app = express();

/* ======================================================
   Security Middleware
====================================================== */

app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

/* ======================================================
   Request Body Parsers
====================================================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/* ======================================================
   Performance & Logging
====================================================== */

app.use(compression());

app.use(morgan("dev"));

/* ======================================================
   Health Check Route
====================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Projexa Backend API 🚀",
  });
});

/* ======================================================
   API Routes
====================================================== */

// Authentication
app.use("/api/v1/auth", authRoutes);

// Projects
app.use("/api/v1/projects", projectRoutes);

// Comments
app.use("/api/v1/comments", commentRoutes);

app.use("/api/v1/likes", likeRoutes);

// Notifications
app.use("/api/v1/notifications", notificationRoutes);

/* ======================================================
   404 Route Handler
====================================================== */

app.use(notFound);

/* ======================================================
   Global Error Handler
====================================================== */

app.use(errorHandler);

export default app;