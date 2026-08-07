const sendResponse = (
  res,
  statusCode,
  {
    success = true,
    message,
    ...rest
  } = {}
) => {
  return res.status(statusCode).json({
    success,
    ...(message && { message }),
    ...rest,
  });
};

module.exports = sendResponse;