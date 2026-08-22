const Message = require("../models/Message");

const createAnnouncement = async (req, res, next) => {
  try {
    const { eventId, text } = req.body;

    const message = await Message.create({
      event: eventId,
      sender: req.user.id,
      text,
    });

    const io = req.app.get("io");

    io.to(`event:${eventId}`).emit("announcement", {
      eventId,
      message,
      createdAt: message.createdAt,
    });

    res.status(201).json({
      success: true,
      message: "Announcement sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const getEventAnnouncements = async (req, res, next) => {
  try {
    const messages = await Message.find({
      event: req.params.eventId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnnouncement,
  getEventAnnouncements,
};