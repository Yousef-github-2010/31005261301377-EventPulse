const Message = require("../models/Message");

const getEventMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      event: req.params.eventId,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getEventMessages,
};