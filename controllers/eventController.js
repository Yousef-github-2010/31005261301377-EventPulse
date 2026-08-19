const Event = require("../models/Event");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    city,
    venue,
    capacity,
    category,
  } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    city,
    venue,
    capacity,
    category,
    organizer: req.user.id,
  });

  sendResponse(res, 201, {
    message: "Event created successfully",
    data: event,
  });
});

const getAllEvents = asyncHandler(async (req, res) => {
  const {
    search,
    city,
    category,
    startDate,
    endDate,
    page,
    limit,
    sortBy,
    order,
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

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const allowedSortFields = ["date", "registrations"];

  const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "date";

  const sortDirection = order === "desc" ? -1 : 1;

  const sort = {
    [sortField]: sortDirection,
  };

  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate("category")
      .populate("organizer")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),

    Event.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  sendResponse(res, 200, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data,
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("category")
    .populate("organizer")
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
  )
    .populate("category")
    .populate("organizer");

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