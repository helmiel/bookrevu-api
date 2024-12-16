import pool from "../src/utils/pool";

const ReviewsTableTestHelper = {
  async addReview({
    id = "review-123",
    user_id = "user-123",
    book_id = "book-123",
    review = "Lorem Ipsum",
  }) {
    const query = {
      text: "INSERT INTO reviews VALUES($1, $2, $3, $4) returning id",
      values: [id, user_id, book_id, review],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },

  async findReviewById(id) {
    const query = {
      text: "SELECT * FROM reviews WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM reviews WHERE 1=1");
  },
};

export default ReviewsTableTestHelper;
