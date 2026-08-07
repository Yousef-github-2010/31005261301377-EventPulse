const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;