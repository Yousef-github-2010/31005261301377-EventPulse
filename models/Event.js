const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    capacity: {
        type: Number,
        required: true,
        min: 1,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }
}, {
    timestamps: true
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;