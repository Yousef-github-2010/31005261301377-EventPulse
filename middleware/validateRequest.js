const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  res.status(422).json({
    success: false,
    errors: errors.array(),
  });
};

module.exports = validateRequest;