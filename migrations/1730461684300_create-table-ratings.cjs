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
  pgm.createType("ratingvalue", ["1", "2", "3", "4", "5"]);
  pgm.createTable("ratings", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    book_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    rating: {
      type: "ratingvalue",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "ratings",
    "fk_ratings.user_id_users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "ratings",
    "fk_ratings.book_id_books.id",
    "FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "ratings",
    "unique_user_rating_book",
    "UNIQUE(user_id, book_id)"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("ratings");
  pgm.dropType("ratingvalue");
};
