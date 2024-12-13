import autoBind from 'auto-bind';

class ReviewsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postReviewHandler(request, h) {
    this._validator.validateReviewPayload(request.payload);
    const { review } = request.payload;
    const { bookId } = request.params;
    const { id: user_id } = request.auth.credentials;
    await this._service.addReviewUserBook({
      user_id,
      book_id: bookId,
      review,
    });
    const response = h.response({
      status: 'success',
      message: 'Review berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getReviewsHandler(request, h) {
    const { bookId } = request.params;

    const reviews = await this._service.getReviewsByBookId(bookId);
    return {
      status: 'success',
      reviews,
    };
  }

  async putReviewHandler(request, h) {
    this._validator.validateReviewPayload(request.payload);
    const { review } = request.payload;
    const { bookId } = request.params;
    const { id: user_id } = request.auth.credentials;
    await this._service.editReviewUserBook({
      user_id,
      book_id: bookId,
      review,
    });
    const response = h.response({
      status: 'success',
      message: 'Review berhasil diubah',
    });
    response.code(200);
    return response;
  }

  async deleteReviewHandler(request, h) {
    const { bookId } = request.params;
    const { id: user_id } = request.auth.credentials;

    await this._service.deleteReviewUserBook({
      user_id,
      book_id: bookId,
    });
    const response = h.response({
      status: 'success',
      message: 'Review berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

export default ReviewsHandler;
