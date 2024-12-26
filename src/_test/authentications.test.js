import init from "../server";
import pool from "../utils/pool";
import UsersTableTestHelper from "../../tests/UsersTableTestHelper";
import AuthenticationsTableTestHelper from "../../tests/AuthenticationsTableTestHelper";

describe("Authentication", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("POST /authentications FR-002", () => {
    it("should respond with 201 and authentication token", async () => {
      // Arrange
      const requestPayload = {
        username: "user",
        password: "secret",
      };
      await UsersTableTestHelper.addUser({});
      const server = await init();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/authentications",
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.message).toEqual(
        "Authentication berhasil ditambahkan"
      );
    });

    it("should respond with 401 when user not found", async () => {
      // Arrange
      const requestPayload = {
        username: "user",
        password: "secret",
      };
      const server = await init();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/authentications",
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "username atau password yang anda masukkan salah"
      );
    });
  });
});
