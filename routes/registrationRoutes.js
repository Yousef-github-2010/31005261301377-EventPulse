const router = require("express").Router();

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { registerEventValidator } = require("../validators");

router.post(
  "/",
  requireAuth,
  requireRole("attendee"),
  registerEventValidator,
  validateRequest,
  registerForEvent
);

router.get("/my", requireAuth, getMyRegistrations);

router.delete("/:id", requireAuth, cancelRegistration);

module.exports = router;
