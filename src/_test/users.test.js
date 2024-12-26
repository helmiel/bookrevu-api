import init from "../server";
import pool from "../utils/pool";
import UsersTableTestHelper from "../../tests/UsersTableTestHelper";

describe("Users", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe("POST /users FR-001", () => {
    it("should respond with 201 and persisted user", async () => {
      // Arrange
      const requestPayload = {
        username: "user",
        email: "jw9m5@example.com",
        password: "secret",
      };
      const server = await init();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/users",
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toBeDefined();
    });

    it("should respond with 400 when payload not contain username", async () => {
      // Arrange
      const requestPayload = {
        email: "jw9m5@example.com",
        password: "secret",
      };
      const server = await init();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/users",
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual('"username" is required');
    });
  });
});
