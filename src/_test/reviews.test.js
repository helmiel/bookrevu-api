import init from "../server";
import pool from "../utils/pool";
import UsersTableTestHelper from "../../tests/UsersTableTestHelper";
import BooksTableTestHelper from "../../tests/BooksTableTestHelper";
import ServerTestHelper from "../../tests/ServerTestHelper";
import ReviewsTableTestHelper from "../../tests/ReviewsTableTestHelper";

describe("Reviews", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await BooksTableTestHelper.addBook({});
  });

  afterEach(async () => {
    await ReviewsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await BooksTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("POST /books/{bookId}/review FR-005", () => {
    it("should respond with 201 and persisted review", async () => {
      // Arrange
      const requestPayload = { review: "Review" };
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/books/book-123/review",
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
        url: "/api/books/book-123/review",
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

  describe("PUT /books/{bookId}/review FR-007", () => {
    it("should respond with 200 and persisted review", async () => {
      // Arrange
      await ReviewsTableTestHelper.addReview({});
      const requestPayload = { review: "Review" };
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/api/books/book-123/review",
        payload: requestPayload,
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

    it("should respond with 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/api/books/book-123/review",
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

  describe("DELETE /books/{bookId}/review FR-009", () => {
    it("should respond with 200", async () => {
      // Arrange
      await ReviewsTableTestHelper.addReview({});
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/api/books/book-123/review",
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

    it("should respond with 404 when review not found", async () => {
      // Arrange
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/api/books/book-123/review",
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
