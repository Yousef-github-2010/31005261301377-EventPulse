const app = require("../app");
const connectDB = require("../config/db");

const handler = async (req, res) => {
  await connectDB();

  return app(req, res);
};

module.exports = handler;