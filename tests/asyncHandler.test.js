const asyncHandler = require("../utils/asyncHandler");

describe("asyncHandler", () => {
  test("should call the controller successfully", async () => {
    const next = jest.fn();
    const handler = asyncHandler(async (req, res) => {
      res.send("Success");
    });

    const res = {
      send: jest.fn(),
    };

    await handler({}, res, next);

    expect(res.send).toHaveBeenCalledWith("Success");
    expect(next).not.toHaveBeenCalled();
  });

  test("should pass errors to next", async () => {
    const error = new Error("Test error");
    const next = jest.fn();

    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});