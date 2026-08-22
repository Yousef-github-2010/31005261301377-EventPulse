const express = require("express");

const {
  createAnnouncement,
  getEventAnnouncements,
} = require("../controllers/announcementController");

const {
  requireAuth,
  requireRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  createAnnouncement
);

router.get(
  "/:eventId",
  getEventAnnouncements
);

module.exports = router;