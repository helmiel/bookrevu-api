import init from "../server";
import pool from "../utils/pool";
import UsersTableTestHelper from "../../tests/UsersTableTestHelper";
import BooksTableTestHelper from "../../tests/BooksTableTestHelper";
import ServerTestHelper from "../../tests/ServerTestHelper";

describe("Books", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await BooksTableTestHelper.cleanTable();
  });

  describe("POST /books FR-003", () => {
    it("should respond with 201 and persisted book", async () => {
      // Arrange
      const requestPayload = {
        title: "Title",
        published: "2021-01-01",
        author: "Author",
        genre: "Genre",
        format: "Format",
        isbn: "1234567890",
        description: "Description",
      };
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/books",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toBeDefined();
    });

    it("should respond with 401 when user not found", async () => {
      // Arrange
      const requestPayload = {
        title: "Title",
        published: "2021-01-01",
        author: "Author",
        genre: "Genre",
        format: "Format",
        isbn: "1234567890",
        description: "Description",
      };
      const server = await init();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/books",
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should respond with 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        published: "2021-01-01",
        author: "Author",
        genre: "Genre",
        format: "Format",
        isbn: "1234567890",
        description: "Description",
      };
      const server = await init();
      const accessToken = await ServerTestHelper.getAccessToken();
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/api/books",
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

  describe("GET /books/search FR-004", () => {
    it("should respond with 200 and filtered books", async () => {
      // Arrange
      const query = "tit";

      await BooksTableTestHelper.addBook({});

      const server = await init();

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/books/search?q=" + query,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.books).toHaveLength(1);
      expect(responseJson.data.books[0].title).toEqual("Title");
    });

    it("should respond with 404 when book not found", async () => {
      // Arrange
      const query = "tit";

      const server = await init();

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/books/search?q=" + query,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });
  });

  describe("GET /books FR-011", () => {
    it("should respond with 200 and all books", async () => {
      // Arrange
      await BooksTableTestHelper.addBook({ id: "book-123" });
      await BooksTableTestHelper.addBook({ id: "book-456" });
      await BooksTableTestHelper.addBook({ id: "book-789" });

      const server = await init();
      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/books",
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.books).toHaveLength(3);
    });
  });

  describe("GET /books/recomendation FR-012", () => {
    it("should respond with 200 and recommended books", async () => {
      // Arrange
      await BooksTableTestHelper.addBook({ id: "book-123" });
      await BooksTableTestHelper.addBook({ id: "book-789" });

      const server = await init();
      // Action
      const response = await server.inject({
        method: "GET",
        url: "/api/books/recomendation",
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.books).toHaveLength(2);
    });
  });
});
