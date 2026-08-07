const Event = require("../models/Event");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, city, capacity, category } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    city,
    capacity,
    category,
  });

  sendResponse(res, 201, {
    message: "Event created successfully",
    data: event,
  });
});

const getAllEvents = asyncHandler(async (req, res) => {
  let {
    search,
    city,
    category,
    startDate,
    endDate,
    page,
    limit,
    sort,
  } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (city) {
    filter.city = {
      $regex: city,
      $options: "i",
    };
  }

  if (category) {
  filter.category = category;
}

if (startDate || endDate) {
  filter.date = {};

  if (startDate) {
    filter.date.$gte = new Date(startDate);
  }

  if (endDate) {
    filter.date.$lte = new Date(endDate);
  }
}

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const skip = (page - 1) * limit;

  let query = Event.find(filter).populate("category");

  switch (sort) {
  case "date":
    query = query.sort({ date: 1 });
    break;

  case "-date":
    query = query.sort({ date: -1 });
    break;

  default:
    query = query.sort({ createdAt: -1 });
  }

  const events = await query
    .skip(skip)
    .limit(limit)
    .lean();

  const totalEvents = await Event.countDocuments(filter);

  sendResponse(res, 200, {
    page,
    totalPages: Math.ceil(totalEvents / limit),
    totalEvents,
    data: events,
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  .populate("category")
  .lean();

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  sendResponse(res, 200, {
    data: event,
  });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category");

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  sendResponse(res, 200, {
    message: "Event updated successfully",
    data: event,
  });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  sendResponse(res, 200, {
    message: "Event deleted successfully",
  });
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};