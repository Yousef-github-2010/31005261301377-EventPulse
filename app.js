require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const swaggerUiDist = require("swagger-ui-dist");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const healthRoutes = require("./routes/healthRoutes");
const messageRoutes = require("./routes/messageRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const { swaggerUi, swaggerDocument } = require("./swagger");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(mongoSanitize());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/health", healthRoutes);

app.use(
  "/api-docs",
  express.static(swaggerUiDist.getAbsoluteFSPath())
);

app.get("/api-docs", (req, res) => {
  res.redirect("/api-docs/");
});

app.get("/api-docs/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>EventPulse API</title>
        <link rel="stylesheet" href="/api-docs/swagger-ui.css">
      </head>
      <body>
        <div id="swagger-ui"></div>

        <script src="/api-docs/swagger-ui-bundle.js"></script>
        <script src="/api-docs/swagger-ui-standalone-preset.js"></script>

        <script>
          window.onload = function() {
            window.ui = SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerDocument)},
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "StandaloneLayout"
            });
          };
        </script>
      </body>
    </html>
  `);
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EventPulse API is Running...",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

app.use(errorMiddleware);

module.exports = app;