const Message = require("../models/Message");
const Event = require("../models/Event");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const getEventMessages = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId).select("_id");

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const messages = await Message.find({
    event: req.params.eventId,
  })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  sendResponse(res, 200, {
    data: messages,
  });
});

module.exports = {
  getEventMessages,
};
