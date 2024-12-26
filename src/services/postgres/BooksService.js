import pool from "../../utils/pool.js";
import { mapDBToModelBook } from "../../utils/map.js";
import { nanoid } from "nanoid";
import NotFoundError from "../../exceptions/NotFoundError.js";
import InvariantError from "../../exceptions/InvariantError.js";

class BooksService {
  constructor() {
    this._pool = pool;
  }

  async addBook({
    title,
    published,
    author,
    genre,
    format,
    isbn,
    description,
    // bookURL,
  }) {
    const id = `book-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO books (id, title, published, author, genre, format, isbn, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        id,
        title,
        published,
        author,
        genre,
        format,
        isbn,
        description,
        // bookURL,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Book gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getBooks() {
    const query = {
      text: "SELECT * FROM books",
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Book tidak ditemukan");
    }

    return result.rows.map(mapDBToModelBook);
  }

  async getBookById(id) {
    const query = {
      text: "SELECT * FROM books WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Book tidak ditemukan");
    }
    return result.rows.map(mapDBToModelBook)[0];
  }

  async getBooksSearch(q) {
    const query = {
      text: "SELECT * FROM books WHERE LOWER(title) LIKE LOWER($1)",
      values: [`%${q}%`],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Book tidak ditemukan");
    }

    return result.rows;
  }

  async editBookCoverbyId(id, book_image_url) {
    const query = {
      text: "UPDATE books SET book_image_url = $1 WHERE id = $2 RETURNING id",
      values: [book_image_url, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Book tidak ditemukan");
    }
  }

  async editBookRatingbyId(id, rating, rowCount) {
    const query = {
      text: "UPDATE books SET ratingtotal = $1, ratingcount = $2 WHERE id = $3 RETURNING id",
      values: [rating.rating, rowCount, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Book tidak ditemukan");
    }
  }

  async getUpcomingBooks() {
    const query = {
      text: `
      SELECT * 
      FROM books 
      WHERE TO_DATE(published, 'Month DD, YYYY') > CURRENT_DATE
      ORDER BY TO_DATE(published, 'Month DD, YYYY') ASC
      LIMIT 10
      `,
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModelBook);
  }

  async getRecomendationBooks() {
    const query = {
      text: `SELECT * FROM books ORDER BY ratingtotal DESC LIMIT 10;`,
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Book tidak ditemukan");
    }

    return result.rows.map(mapDBToModelBook);
  }

  async getReviewHomeBook() {
    const query = {
      text: `
      SELECT b.id, b.title, b.author, b.book_image_url
      FROM books b
      JOIN (
        SELECT book_id, COUNT(*) as review_count
        FROM reviews
        GROUP BY book_id
        ORDER BY review_count DESC
        LIMIT 1
      ) r ON b.id = r.book_id;
      `,
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Book tidak ditemukan");
    }
    return result.rows.map(mapDBToModelBook);
  }

  async getRatingHomeBook() {
    const query = {
      text: `SELECT id, title, author, book_image_url FROM public.books ORDER BY ratingtotal DESC LIMIT 1;`,
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Book tidak ditemukan");
    }
    return result.rows.map(mapDBToModelBook);
  }
}

export default BooksService;
