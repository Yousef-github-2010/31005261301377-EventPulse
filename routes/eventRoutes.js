const router = require("express").Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const {
  requireAuth,
  requireRole,
} = require("../middleware/authMiddleware");

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  createEvent
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  updateEvent
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteEvent
);

module.exports = router;