const sendResponse = require("../utils/sendResponse");

const errorMiddleware = (err, req, res, next) => {
  sendResponse(res, err.statusCode || 500, {
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;