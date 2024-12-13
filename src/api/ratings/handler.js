import autoBind from "auto-bind";

class RatingsHandler {
  constructor(RatingsService, BooksService, validator) {
    this._ratingsService = RatingsService;
    this._bookService = BooksService;
    this._validator = validator;

    autoBind(this);
  }

  async postRatingHandler(request, h) {
    this._validator.validateRatingPayload(request.payload);

    const { bookId } = request.params;
    const { rating } = request.payload;
    const { id: user_id } = request.auth.credentials;
    await this._ratingsService.addRatingUserBook({
      user_id,
      book_id: bookId,
      rating,
    });

    const { rows, rowCount } = await this._ratingsService.getRatingsByBookId(
      bookId
    );

    const totalRating = rows.reduce((sum, current) => {
      return sum + Number(current.rating); // Convert to number and add
    }, 0);

    await this._bookService.editBookRatingbyId(
      bookId,
      {
        rating: totalRating / rowCount,
      },
      rowCount
    );
    const response = h.response({
      status: "success",
      message: "Rating berhasil ditambahkan",
    });
    response.code(201);
    return response;
  }

  async deleteRatingHandler(request, h) {
    const { bookId } = request.params;
    const { id: user_id } = request.auth.credentials;

    // Delete the rating for the book by the user
    await this._ratingsService.deleteRatingUserBook({
      user_id,
      book_id: bookId,
    });

    // Retrieve all remaining ratings for the book
    const { rows, rowCount } = await this._ratingsService.getRatingsByBookId(
      bookId
    );

    // Calculate the new average rating
    const totalRating = rows.reduce((sum, current) => {
      return sum + Number(current.rating);
    }, 0);

    // Update the book's rating
    await this._bookService.editBookRatingbyId(
      bookId,
      { rating: totalRating / rowCount },
      rowCount
    );

    // Respond with success
    const response = h.response({
      status: "success",
      message: "Rating berhasil dihapus",
    });
    response.code(200);
    return response;
  }
}

export default RatingsHandler;
