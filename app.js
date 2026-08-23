require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db");
const Registration = require("./models/Registration");
const Event = require("./models/Event");

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

app.use(cors());
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
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/", (req, res) => {
  res.send("EventPulse API is Running...");
});

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token is required."));
    }

    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(new Error("Invalid or expired token."));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-event", async (eventId, callback) => {
    try {
      const event = await Event.findById(eventId).select("_id");

      if (!event) {
        const message = "Event not found";
        if (typeof callback === "function") callback({ success: false, message });
        return;
      }

      const registration = await Registration.findOne({
        event: eventId,
        attendee: socket.user.id,
      }).select("_id");

      if (!registration && socket.user.role !== "admin") {
        const message = "You must be registered for this event";
        if (typeof callback === "function") callback({ success: false, message });
        return;
      }

      await socket.join(`event:${eventId}`);

      if (typeof callback === "function") {
        callback({
          success: true,
          eventId,
        });
      }
    } catch (error) {
      if (typeof callback === "function") {
        callback({
          success: false,
          message: "Unable to join event",
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("io", io);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
