const express = require("express");

const { register, login } = require("../controllers/authController");

const validateRequest = require("../middleware/validateRequest");

const {
  registerValidator,
  loginValidator,
} = require("../validators");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
);

module.exports = router;