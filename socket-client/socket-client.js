const { io } = require("socket.io-client");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODk4MzhhNjQyYmMxYTJmZWRhMzQ0MCIsInJvbGUiOiJhdHRlbmRlZSIsImlhdCI6MTc4NzM5NzgzOCwiZXhwIjoxNzg4MDAyNjM4fQ.e08zYXcfGwzE_qxSc1aw6UU6CUOPEkfgc3oY8f4eVns";

const eventId = "6a89838b642bc1a2feda3446";

const socket = io("http://localhost:3000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Connected to Socket.io:", socket.id);

  socket.emit("join-event", eventId);

  console.log("Joined event:", eventId);
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
