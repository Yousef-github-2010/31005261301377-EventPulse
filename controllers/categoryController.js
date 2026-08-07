const Category = require("../models/Category");

const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().lean();

  sendResponse(res, 200, {
    count: categories.length,
    data: categories,
  });
});

module.exports = {
  getCategories,
};