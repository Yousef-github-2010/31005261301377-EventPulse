const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const createEventValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("date")
    .isISO8601()
    .withMessage("Valid date is required"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("venue")
    .trim()
    .notEmpty()
    .withMessage("Venue is required"),

  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1"),

  body("category")
    .isMongoId()
    .withMessage("Valid category ID is required"),
];

const updateEventValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Valid date is required"),

  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),

  body("venue")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Venue cannot be empty"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Valid category ID is required"),
];

const registerEventValidator = [
  body("event")
    .isMongoId()
    .withMessage("Valid event ID is required"),
];

const announcementValidator = [
  body("eventId")
    .isMongoId()
    .withMessage("Valid event ID is required"),

  body("text")
    .trim()
    .notEmpty()
    .withMessage("Announcement text is required"),
];

module.exports = {
  registerValidator,
  loginValidator,
  createEventValidator,
  updateEventValidator,
  registerEventValidator,
  announcementValidator,
};
