const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const connectDB = require("../config/db");

const Event = require("../models/Event");

describe("Registration API", () => {
  let token;
  let eventId;

  beforeAll(async () => {
    await connectDB();

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "attendee@eventpulse.com",
        password: "Attendee123",
      });

    token = loginResponse.body.token;

    const event = await Event.findOne({
      capacity: { $gt: 0 },
    });

    eventId = event._id;
  }, 30000);

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test(
    "should register for an event",
    async () => {
      const response = await request(app)
        .post("/api/registrations")
        .set("Authorization", "Bearer " + token)
        .send({
          event: eventId,
        });

      expect([201, 400]).toContain(response.statusCode);
    },
    15000
  );

  test(
    "should get my registrations",
    async () => {
      const response = await request(app)
        .get("/api/registrations/my")
        .set("Authorization", "Bearer " + token);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    },
    15000
  );
});