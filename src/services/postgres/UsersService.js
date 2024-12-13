import pkg from "pg";
const { Pool } = pkg;
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import AuthenticationError from "../../exceptions/AuthenticationError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
import bcrypt from "bcrypt";

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, email, password }) {
    await this.verifyNewUsername(username);
    await this.verifyNewEmail(email);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users (id, username, email, displayname, password) VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, username, email, username, hashedPassword],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("User gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Email sudah digunakan."
      );
    }
  }

  async getUserById(id) {
    const query = {
      text: "SELECT id, username, email, displayname, profile_image_url, role  FROM users WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, email, displayname, role, password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError(
        "username atau password yang anda masukkan salah"
      );
    }

    const {
      id,
      email,
      displayname,
      role,
      password: hashedPassword,
    } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError(
        "username atau password yang anda masukkan salah"
      );
    }

    return { id, email, displayname, role };
  }

  async editUserDisplaynameById(id, displayname) {
    const query = {
      text: "UPDATE users SET displayname = $1 WHERE id = $2 RETURNING id, displayname",
      values: [displayname, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async editUserProfilePictureById(id, profile_picture_url) {
    const query = {
      text: "UPDATE users SET profile_image_url = $1 WHERE id = $2 RETURNING id, profile_image_url",
      values: [profile_picture_url, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async getAllUsers() {
    const query = {
      text: "SELECT id, username, email, displayname, profile_image_url, role FROM users",
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addAdmin(id) {
    const query = {
      text: "UPDATE users SET role = 'admin' WHERE id = $1 RETURNING id, role",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return result.rows[0];
  }

  async deleteUserProfilePictureById(id) {
    const getImageurlQuery = {
      text: "SELECT profile_image_url FROM users WHERE id = $1",
      values: [id],
    };

    const query = {
      text: "UPDATE users SET profile_image_url = NULL WHERE id = $1 RETURNING id",
      values: [id],
    };
    const imageurl = await this._pool.query(getImageurlQuery);
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return {
      id: result.rows[0].id,
      profile_image_url: imageurl.rows[0].profile_image_url,
    };
  }
}

export default UsersService;
