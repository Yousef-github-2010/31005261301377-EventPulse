const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const connectDB = require("../config/db");

const Event = require("../models/Event");
const User = require("../models/User");
const Category = require("../models/Category");
const Registration = require("../models/Registration");

describe("Registration API", () => {
  let attendeeToken;
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

    expect(loginResponse.statusCode).toBe(200);
    attendeeToken = loginResponse.body.token;

    const attendee = await User.findOne({
      email: "attendee@eventpulse.com",
    });

    const category = await Category.findOne();

    if (!attendee || !category) {
      throw new Error("Required test data is missing");
    }

    const testEvent = await Event.create({
      title: `Registration Test Event ${Date.now()}`,
      description: "Temporary event for registration tests",
      category: category._id,
      date: new Date("2027-01-15T00:00:00.000Z"),
      city: "Cairo",
      venue: "Test Venue",
      capacity: 1,
      organizer: attendee._id,
    });

    eventId = testEvent._id;
  }, 30000);

  afterAll(async () => {
    if (registrationId) {
      await Registration.findByIdAndDelete(registrationId);
    }

    if (eventId) {
      await Event.findByIdAndDelete(eventId);
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test("should require a valid event ID", async () => {
    const response = await request(app)
      .post("/api/registrations")
      .set("Authorization", `Bearer ${attendeeToken}`)
      .send({ event: "invalid-id" });

    expect(response.statusCode).toBe(422);
  });

  test("should register for an event", async () => {
    const response = await request(app)
      .post("/api/registrations")
      .set("Authorization", `Bearer ${attendeeToken}`)
      .send({
        event: eventId.toString(),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.event.toString()).toBe(eventId.toString());

    registrationId = response.body.data._id;
  }, 15000);

  test("should reject duplicate registration", async () => {
    const response = await request(app)
      .post("/api/registrations")
      .set("Authorization", `Bearer ${attendeeToken}`)
      .send({
        event: eventId.toString(),
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "You are already registered for this event"
    );
  }, 15000);

  test("should get my registrations", async () => {
    const response = await request(app)
      .get("/api/registrations/my")
      .set("Authorization", `Bearer ${attendeeToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);

    const registration = response.body.data.find(
      (item) => item.event?._id === eventId.toString()
    );

    expect(registration).toBeDefined();
  }, 15000);

  test("should cancel my registration", async () => {
    const response = await request(app)
      .delete(`/api/registrations/${registrationId}`)
      .set("Authorization", `Bearer ${attendeeToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Registration cancelled successfully"
    );

    registrationId = null;
  }, 15000);
});
