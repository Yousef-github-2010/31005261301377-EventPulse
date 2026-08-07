const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const healthRoutes = require("./routes/healthRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { swaggerUi, swaggerDocument } = require("./swagger");

const Message = require("./models/Message");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/health", healthRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/", (req, res) => {
  res.send("EventPulse API is Running...");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Invalid or expired token."));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id, socket.user.role);

  socket.on("joinEvent", (eventId) => {
    socket.join(`event:${eventId}`);
  });

  socket.on("sendAnnouncement", async ({ eventId, message }) => {
    try {
      if (socket.user.role !== "admin") {
        return socket.emit("error", {
          message: "Only admins can send announcements.",
        });
      }

      const newMessage = await Message.create({
        event: eventId,
        sender: socket.user.id,
        message,
      });

      io.to(`event:${eventId}`).emit("announcement", {
        eventId,
        message: newMessage.message,
        sender: newMessage.sender,
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      socket.emit("error", {
        message: "Failed to send announcement.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

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