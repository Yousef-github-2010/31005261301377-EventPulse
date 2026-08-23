require("dotenv").config();

const { io } = require("socket.io-client");

const token = process.env.ATTENDEE_TOKEN;
const eventId = process.env.EVENT_ID;
const socketUrl = process.env.SOCKET_URL || "http://localhost:3000";

if (!token || !eventId) {
  console.error(
    "Missing ATTENDEE_TOKEN or EVENT_ID in your .env file."
  );
  process.exit(1);
}

const socket = io(socketUrl, {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Connected to Socket.io:", socket.id);

  socket.emit("join-event", eventId, (response) => {
    if (!response?.success) {
      console.error("Failed to join event:", response?.message);
      return;
    }

    console.log("Joined event:", response.eventId);
  });
});

socket.on("announcement", (data) => {
  console.log("New announcement:");
  console.log(data);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
