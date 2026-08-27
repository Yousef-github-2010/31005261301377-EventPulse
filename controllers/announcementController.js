const mongoose = require("mongoose");

const Message = require("../models/Message");
const Event = require("../models/Event");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const createAnnouncement = asyncHandler(async (req, res) => {
  const { eventId, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const event = await Event.findById(eventId).select("_id");

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const message = await Message.create({
    event: eventId,
    sender: req.user.id,
    text,
  });

  const io = req.app.get("io");

  if (io) {
    io.to(`event:${eventId}`).emit("announcement", {
      eventId,
      message,
      createdAt: message.createdAt,
    });
  }

  sendResponse(res, 201, {
    message: "Announcement sent successfully",
    data: message,
  });
});

const getEventAnnouncements = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new AppError("Invalid event ID", 400);
  }

  const event = await Event.findById(eventId).select("_id");

  if (!event) {
    throw new AppError("Event not found", 404);
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
  createAnnouncement,
  getEventAnnouncements,
};
