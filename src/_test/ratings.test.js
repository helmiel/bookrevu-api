import init from "../server";
import pool from "../utils/pool";
import UsersTableTestHelper from "../../tests/UsersTableTestHelper";
import BooksTableTestHelper from "../../tests/BooksTableTestHelper";
import ServerTestHelper from "../../tests/ServerTestHelper";
import RatingsTableTestHelper from "../../tests/RatingsTableTestHelper";

describe("Ratings", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await BooksTableTestHelper.addBook({});
  });

  afterEach(async () => {
    await RatingsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await BooksTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("POST /books/{bookId}/rating FR-006", () => {
    it("should respond with 201 and persisted rating", async () => {
      // Arrange
      const requestPayload = { rating: 5 };
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/books/book-123/rating",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
    });

    it("should respond with 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/books/book-123/rating",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });
  });

  describe("EDIT /books/{bookId}/rating FR-008", () => {
    it("should respond with 200 and persisted rating", async () => {
      // Arrange
      await RatingsTableTestHelper.addRating({});
      const requestPayload = { rating: 3 };
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      await server.inject({
        method: "POST",
        url: "/api/books/book-123/rating",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await server.inject({
        method: "POST",
        url: "/api/books/book-123/rating",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
    });
  });

  describe("DELETE /books/{bookId}/rating FR-010", () => {
    it("should respond with 200", async () => {
      // Arrange
      await RatingsTableTestHelper.addRating({});
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/api/books/book-123/rating",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.message).toBeDefined();
    });

    it("should respond with 404 when rating not found", async () => {
      // Arrange
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/api/books/book-123/rating",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });
  });
});
