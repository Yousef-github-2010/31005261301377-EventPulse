require("dotenv").config();

const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const Registration = require("./models/Registration");
const Event = require("./models/Event");

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

        if (typeof callback === "function") {
          callback({
            success: false,
            message,
          });
        }

        return;
      }

      const registration = await Registration.findOne({
        event: eventId,
        attendee: socket.user.id,
      }).select("_id");

      if (!registration && socket.user.role !== "admin") {
        const message = "You must be registered for this event";

        if (typeof callback === "function") {
          callback({
            success: false,
            message,
          });
        }

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

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();