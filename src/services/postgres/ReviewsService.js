import pgk from "pg";
const { Pool } = pgk;
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

class ReviewsService {
  constructor() {
    this._pool = new Pool();
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
}

export default ReviewsService;