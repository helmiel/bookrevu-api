import pool from "../src/utils/pool";

const BooksTableTestHelper = {
  async addBook({
    id = "book-123",
    title = "Title",
    published = "2021-01-01",
    author = "Author",
    genre = "Genre",
    format = "Format",
    isbn = "1234567890",
    description = "Description",
  }) {
    const query = {
      text: "INSERT INTO books VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [id, title, published, author, genre, format, isbn, description],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },

  async findBookById(id) {
    const query = {
      text: "SELECT * FROM books WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM books WHERE 1=1");
  },
};

export default BooksTableTestHelper;
