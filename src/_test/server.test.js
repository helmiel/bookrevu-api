import init from "../server";

describe("server", () => {
  it("should respond with 404 when requesting an unregistered route", async () => {
    const server = await init(); // Call the init function
    const response = await server.inject({
      method: "GET",
      url: "/api/unregisteredRoute",
    });

    expect(response.statusCode).toEqual(404);
  });
});
