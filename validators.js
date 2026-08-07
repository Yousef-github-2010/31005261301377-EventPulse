const { body } = require("express-validator");

// ==========================
// Auth
// ==========================

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Events

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

  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),
];

const updateEventValidator = createEventValidator;

// Registration

const registerEventValidator = [
  body("eventId")
    .notEmpty()
    .withMessage("Event ID is required"),
];

module.exports = {
  registerValidator,
  loginValidator,
  createEventValidator,
  updateEventValidator,
  registerEventValidator,
};