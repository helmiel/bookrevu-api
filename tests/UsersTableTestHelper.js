import pool from "../src/utils/pool";
import bcrypt from "bcrypt";

const UsersTableTestHelper = {
  async addUser({
    id = `user-123`,
    username = "user",
    email = "jw9m5@example.com",
    displayname = "user",
    password = "secret",
    role = "admin",
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users(id, username, email, displayname, password, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, username, email, displayname, hashedPassword, role],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },

  async findUserById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM users WHERE 1=1");
  },
};

export default UsersTableTestHelper;
