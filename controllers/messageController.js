const mongoose = require("mongoose");

const Message = require("../models/Message");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const getEventMessages = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const event = await Event.findById(eventId).select("_id");

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (req.user.role !== "admin") {
    const registration = await Registration.findOne({
      event: eventId,
      attendee: userId,
    }).select("_id");

    if (!registration) {
      throw new AppError(
        "You must be registered for this event",
        403
      );
    }
  }

  const messages = await Message.find({
    event: eventId,
  })
    .populate("sender", "name email")
    .sort({ createdAt: 1 })
    .lean();

  sendResponse(res, 200, {
    data: messages,
  });
});

module.exports = {
  getEventMessages,
};
