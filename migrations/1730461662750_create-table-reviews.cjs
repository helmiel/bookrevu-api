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
  pgm.createTable("reviews", {
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
    review: {
      type: "TEXT",
      notNull: true,
    },
  });
  pgm.addConstraint(
    "reviews",
    "fk_reviews.user_id_users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "reviews",
    "fk_reviews.book_id_books.id",
    "FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "reviews",
    "unique_user_review_book",
    "UNIQUE(user_id, book_id)"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("reviews");
};
