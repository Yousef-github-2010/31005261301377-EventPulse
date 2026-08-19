const Registration = require("../models/Registration");
const Event = require("../models/Event");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const registerForEvent = asyncHandler(async (req, res) => {
  if (req.user.role !== "attendee") {
    throw new AppError(
      "Only attendees can register for events.",
      403
    );
  }

  const { eventId } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const existingRegistration = await Registration.findOne({
    user: req.user.userId,
    event: eventId,
  });

  if (existingRegistration) {
    throw new AppError(
      "You are already registered for this event.",
      400
    );
  }

  const registrationCount = await Registration.countDocuments({
    event: eventId,
  });

  if (registrationCount >= event.capacity) {
    throw new AppError("Event is full.", 400);
  }

  const registration = await Registration.create({
    user: req.user.userId,
    event: eventId,
  });

  sendResponse(res, 201, {
    message: "Registered successfully.",
    data: registration,
  });
});

const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({
    user: req.user.userId,
  })
    .populate("event")
    .lean();

  sendResponse(res, 200, {
    count: registrations.length,
    data: registrations,
  });
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new AppError("Registration not found.", 404);
  }

  if (registration.user.toString() !== req.user.userId) {
    throw new AppError(
      "You can only cancel your own registration.",
      403
    );
  }

  await registration.deleteOne();

  sendResponse(res, 200, {
    message: "Registration cancelled successfully.",
  });
});

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};