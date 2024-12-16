import pool from "../../utils/pool.js";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

class ReviewsService {
  constructor() {
    this._pool = pool;
  }

  async addReviewUserBook({ user_id, book_id, review }) {
    await this.verifyNewReview({ user_id, book_id });
    const id = `review-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO reviews VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, user_id, book_id, review],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Review gagal ditambahkan");
    }
  }

  async verifyNewReview({ user_id, book_id }) {
    const query = {
      text: "SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2",
      values: [user_id, book_id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError("Gagal menambahkan review. Review sudah ada.");
    }
  }

  async getReviewsByBookId(book_id) {
    const query = {
      text: `
      SELECT reviews.id as review_id, reviews.review, users.id as user_id, users.displayname
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.book_id = $1
    `,
      values: [book_id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getReviewUserBook({ user_id, book_id }) {
    const query = {
      text: "SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2",
      values: [user_id, book_id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Review tidak ditemukan");
    }
    return result.rows[0];
  }

  async editReviewUserBook({ user_id, book_id, review }) {
    const query = {
      text: "UPDATE reviews SET review = $1 WHERE user_id = $2 AND book_id = $3 RETURNING id",
      values: [review, user_id, book_id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal mengubah Review. Review tidak ada.");
    }
  }

  async deleteReviewUserBook({ user_id, book_id }) {
    const query = {
      text: "DELETE FROM Reviews WHERE user_id = $1 AND book_id = $2",
      values: [user_id, book_id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Gagal menghapus Review. Review tidak ada.");
    }
  }
}

export default ReviewsService;
