const request = require("supertest");

const app = require("../app");
const connectDB = require("../config/db");

const Category = require("../models/Category");

describe("Events API", () => {
  let token;
  let categoryId;

  beforeAll(async () => {
    await connectDB();

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@eventpulse.com",
        password: "Admin123",
      });

    token = loginResponse.body.token;

    const category = await Category.findOne();

    if (!category) {
      throw new Error("No category found in database");
    }

    categoryId = category._id;
  }, 30000);

  test("should create an event", async () => {
    const response = await request(app)
      .post("/api/events")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Jest Test Event",
        description: "Event created for testing",
        date: "2026-12-01",
        city: "Cairo",
        venue: "Jest Test Venue",
        capacity: 50,
        category: categoryId,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  }, 15000);

  test("should list events", async () => {
    const response = await request(app)
      .get("/api/events");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  }, 15000);

  test("should filter events by city", async () => {
    const response = await request(app)
      .get("/api/events")
      .query({
        city: "Cairo",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  }, 15000);
});