import pool from "../../utils/pool.js";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

class RatingsService {
  constructor() {
    this._pool = pool;
  }

  async addRatingUserBook({ user_id, book_id, rating }) {
    await this.verifyNewRating({ user_id, book_id });
    const id = `rating-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO ratings VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, user_id, book_id, rating],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Rating gagal ditambahkan");
    }
  }

  async verifyNewRating({ user_id, book_id }) {
    const query = {
      text: "SELECT * FROM ratings WHERE user_id = $1 AND book_id = $2",
      values: [user_id, book_id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      this.deleteRatingUserBook({ user_id, book_id });
    }
  }

  async getRatingsByBookId(book_id) {
    const query = {
      text: "SELECT rating FROM ratings WHERE book_id = $1",
      values: [book_id],
    };
    const { rows, rowCount } = await this._pool.query(query);
    return { rows, rowCount };
  }

  async deleteRatingUserBook({ user_id, book_id }) {
    const query = {
      text: "DELETE FROM ratings WHERE user_id = $1 AND book_id = $2",
      values: [user_id, book_id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Gagal menghapus rating. Rating tidak ada.");
    }
  }
}

export default RatingsService;
