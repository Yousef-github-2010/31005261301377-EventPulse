const AppError = require("../utils/AppError");

describe("AppError", () => {
  test("should create a 404 error correctly", () => {
    const error = new AppError("Event not found", 404);

    expect(error.message).toBe("Event not found");
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe("fail");
  });

  test("should create a 500 error correctly", () => {
    const error = new AppError("Server error", 500);

    expect(error.message).toBe("Server error");
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe("error");
  });
});