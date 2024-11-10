const mapDBToModelBook = ({
  id,
  title,
  published,
  author,
  genre,
  format,
  isbn,
  description,
  bookURL,
  book_image_url,
  ratingtotal,
  ratingcount,
}) => ({
  id,
  title,
  published,
  author,
  genre,
  format,
  isbn,
  description,
  bookURL,
  book_image_url,
  ratingtotal,
  ratingcount,
});

export { mapDBToModelBook };
