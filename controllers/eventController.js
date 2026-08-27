const mongoose = require("mongoose");

const Event = require("../models/Event");
const Registration = require("../models/Registration");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const allowedSortFields = [
  "date",
  "title",
  "city",
  "capacity",
  "createdAt",
  "registrations",
];

const validateObjectId = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(message, 400);
  }
};

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
    const safeSearch = escapeRegex(search);

    filter.$or = [
      {
        title: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        description: {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ];
  }

  if (city) {
    filter.city = {
      $regex: escapeRegex(city),
      $options: "i",
    };
  }

  if (category) {
    validateObjectId(category, "Invalid category ID");
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      const parsedStartDate = new Date(startDate);

      if (Number.isNaN(parsedStartDate.getTime())) {
        throw new AppError("Invalid startDate", 400);
      }

      filter.date.$gte = parsedStartDate;
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate);

      if (Number.isNaN(parsedEndDate.getTime())) {
        throw new AppError("Invalid endDate", 400);
      }

      parsedEndDate.setHours(23, 59, 59, 999);

      filter.date.$lte = parsedEndDate;
    }
  }

  const pageNum = Math.max(
    Number.parseInt(page, 10) || 1,
    1
  );

  const limitNum = Math.min(
    Math.max(Number.parseInt(limit, 10) || 10, 1),
    100
  );

  const skip = (pageNum - 1) * limitNum;

  const requestedSortField = sortBy || "date";

  const sortField = allowedSortFields.includes(
    requestedSortField
  )
    ? requestedSortField
    : "date";

  const sortDirection = order === "desc" ? -1 : 1;

  if (sortField === "registrations") {
    const events = await Event.find(filter)
      .populate("category")
      .populate("organizer")
      .lean();

    const eventIds = events.map((event) => event._id);

    const registrationCounts = await Registration.aggregate([
      {
        $match: {
          event: {
            $in: eventIds,
          },
        },
      },
      {
        $group: {
          _id: "$event",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const countMap = new Map(
      registrationCounts.map((item) => [
        item._id.toString(),
        item.count,
      ])
    );

    const eventsWithCounts = events.map((event) => ({
      ...event,
      registrationsCount:
        countMap.get(event._id.toString()) || 0,
    }));

    eventsWithCounts.sort((a, b) => {
      const countA = a.registrationsCount;
      const countB = b.registrationsCount;

      return sortDirection === 1
        ? countA - countB
        : countB - countA;
    });

    const total = eventsWithCounts.length;

    const data = eventsWithCounts.slice(
      skip,
      skip + limitNum
    );

    const totalPages = Math.ceil(total / limitNum);

    return sendResponse(res, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data,
    });
  }

  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate("category")
      .populate("organizer")
      .sort({
        [sortField]: sortDirection,
      })
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
  const { id } = req.params;

  validateObjectId(id, "Invalid event ID");

  const event = await Event.findById(id)
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
  const { id } = req.params;

  validateObjectId(id, "Invalid event ID");

  const event = await Event.findByIdAndUpdate(
    id,
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
  const { id } = req.params;

  validateObjectId(id, "Invalid event ID");

  const event = await Event.findByIdAndDelete(id);

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