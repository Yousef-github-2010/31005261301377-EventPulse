require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const healthRoutes = require("./routes/healthRoutes");
const messageRoutes = require("./routes/messageRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const { swaggerUi, swaggerDocument } = require("./swagger");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(mongoSanitize());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/health", healthRoutes);

app.use(
  "/api-docs",
  swaggerUi.serveFiles(swaggerDocument),
  swaggerUi.setup(swaggerDocument)
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventPulse API is Running...",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

app.use(errorMiddleware);

module.exports = app;