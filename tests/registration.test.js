const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const connectDB = require("../config/db");

const Event = require("../models/Event");
const Registration = require("../models/Registration");

describe("Registration API", () => {
  let token;
  let eventId;
  let registrationId;

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

    const registration = await Registration.findOne({
      event: eventId,
    });

    if (registration) {
      registrationId = registration._id;
    }
  }, 15000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should register for an event", async () => {
    const response = await request(app)
      .post("/api/registrations")
      .set("Authorization", "Bearer " + token)
      .send({
        event: eventId,
      });

    expect([201, 400]).toContain(response.statusCode);
  });

  test("should get my registrations", async () => {
    const response = await request(app)
      .get("/api/registrations/my")
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("should cancel my registration", async () => {
    const registration = await Registration.findOne({
      attendee: new mongoose.Types.ObjectId(
        "6a85fc9bc00224cecf113f6c"
      ),
    });

    if (!registration) {
      return;
    }

    const response = await request(app)
      .delete(`/api/registrations/${registration._id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});