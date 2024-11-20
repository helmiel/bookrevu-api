import autoBind from "auto-bind";

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
      status: "success",
      message: "Review berhasil ditambahkan",
    });
    response.code(201);
    return response;
  }
}

export default ReviewsHandler;
