const express = require("express");

const {
  createAnnouncement,
  getEventAnnouncements,
} = require("../controllers/announcementController");

const {
  requireAuth,
  requireRole,
} = require("../middleware/authMiddleware");

const validateRequest = require("../middleware/validateRequest");
const {
  announcementValidator,
} = require("../validators");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  announcementValidator,
  validateRequest,
  createAnnouncement
);

router.get(
  "/:eventId",
  getEventAnnouncements
);

module.exports = router;
