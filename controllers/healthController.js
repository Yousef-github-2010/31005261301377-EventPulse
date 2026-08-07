const mongoose = require("mongoose");

const sendResponse = require("../utils/sendResponse");

const healthCheck = (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  sendResponse(res, 200, {
    success: true,
    message: "Server is running",
    data: {
      database: isConnected ? "Connected" : "Disconnected",
    },
  });
};

module.exports = {
  healthCheck,
};