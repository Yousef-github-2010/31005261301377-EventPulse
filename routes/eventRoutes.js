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

const validateRequest = require("../middleware/validateRequest");
const {
  createEventValidator,
  updateEventValidator,
} = require("../validators");

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  createEventValidator,
  validateRequest,
  createEvent
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  updateEventValidator,
  validateRequest,
  updateEvent
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteEvent
);

module.exports = router;
