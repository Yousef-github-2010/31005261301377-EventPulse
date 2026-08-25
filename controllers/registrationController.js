const Registration = require("../models/Registration");
const Event = require("../models/Event");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const registerForEvent = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const eventId = req.body.event;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const existing = await Registration.findOne({
    event: eventId,
    attendee: userId,
  });

  if (existing) {
    throw new AppError(
      "You are already registered for this event",
      400
    );
  }

  const currentCount = await Registration.countDocuments({
    event: eventId,
  });

  if (currentCount >= event.capacity) {
    throw new AppError("This event is full", 400);
  }

  try {
    const registration = await Registration.create({
      event: eventId,
      attendee: userId,
    });

    sendResponse(res, 201, {
      message: "Registration created successfully",
      data: registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(
        "You are already registered for this event",
        400
      );
    }

    throw error;
  }
});

const getMyRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const registrations = await Registration.find({
    attendee: userId,
  }).populate("event");

  sendResponse(res, 200, {
    data: registrations,
  });
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const registrationId = req.params.id;

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    throw new AppError("Registration not found", 404);
  }

  if (registration.attendee.toString() !== userId) {
    throw new AppError(
      "You can only cancel your own registration",
      403
    );
  }

  await registration.deleteOne();

  sendResponse(res, 200, {
    message: "Registration cancelled successfully",
  });
});

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};