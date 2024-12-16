import pool from "../src/utils/pool";

const RatingsTableTestHelper = {
  async addRating({
    id = "rating-123",
    user_id = "user-123",
    book_id = "book-123",
    rating = 5,
  }) {
    const query = {
      text: "INSERT INTO ratings VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, user_id, book_id, rating],
    };
    const result = await pool.query(query);

    const updateBookQuery = {
      text: "UPDATE books SET ratingtotal = $1, ratingcount = $2 WHERE id = $3 RETURNING id",
      values: [rating, 1, book_id],
    };

    await pool.query(updateBookQuery);

    return result.rows[0].id;
  },

  async findRatingsById(id) {
    const query = {
      text: "SELECT * FROM ratings WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM ratings WHERE 1=1");
  },
};

export default RatingsTableTestHelper;
