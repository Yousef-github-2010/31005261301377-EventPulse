const express = require("express");

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const {
  requireAuth,
} = require("../middleware/authMiddleware");

const validateRequest = require("../middleware/validateRequest");

const {
  registerEventValidator,
} = require("../validators");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  registerEventValidator,
  validateRequest,
  registerForEvent
);

router.get(
  "/my",
  requireAuth,
  getMyRegistrations
);

router.delete(
  "/:id",
  requireAuth,
  cancelRegistration
);

module.exports = router;