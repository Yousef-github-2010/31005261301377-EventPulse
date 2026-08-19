const router = require("express").Router();

const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");

const {
  requireAuth,
} = require("../middleware/authMiddleware");

router.post("/", requireAuth, registerForEvent);

router.get("/my", requireAuth, getMyRegistrations);

router.delete("/:id", requireAuth, cancelRegistration);

module.exports = router;