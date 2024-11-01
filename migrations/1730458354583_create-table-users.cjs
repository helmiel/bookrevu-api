/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createType("user_role", ["user", "admin"]);

  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR(50)",
      notNull: true,
      unique: true,
    },
    email: {
      type: "TEXT",
      notNull: true,
      unique: true,
    },
    displayname: {
      type: "TEXT",
      notNull: true,
    },
    password: {
      type: "TEXT",
      notNull: true,
    },
    profile_image_url: {
      type: "TEXT",
      notNull: false,
    },
    role: {
      type: "user_role",
      notNull: true,
      default: "user",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("users");
  pgm.dropType("user_role");
};