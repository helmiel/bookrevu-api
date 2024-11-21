import autoBind from "auto-bind";

class BooksHandler {
  constructor(booksService, storageService, validator) {
    this._booksService = booksService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postBookHandler(request, h) {
    this._validator.validateBookPayload(request.payload);
    const {
      title,
      published,
      author,
      genre,
      format,
      isbn,
      description,
      // bookURL,
    } = request.payload;

    const id = await this._booksService.addBook({
      title,
      published,
      author,
      genre,
      format,
      isbn,
      description,
      // bookURL,
    });
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  async postBookCoverByIdHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateBookCoverHeader(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;
    await this._booksService.editBookCoverbyId(id, url);
    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }

  async getBooksHandler() {
    const books = await this._booksService.getBooks();
    return {
      status: "success",
      data: {
        books,
      },
    };
  }

  // async getBookByIdHandler(request, h) {
  //   const { id } = request.params;
  //   const book = await this._booksService.getBookById(id);
  //   const response = h.response({
  //     status: "success",
  //     data: {
  //       book,
  //     },
  //   });
  //   response.code(200);
  //   return response;
  // }

  async getBooksSearchHandler(request, h) {
    const { q } = request.query;
    this._validator.validateSearchBookPayload(request.query);
    const books = await this._booksService.getBooksSearch(q);
    const response = h.response({
      status: "success",
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  async getUpcomingBooksHandler() {
    const books = await this._booksService.getUpcomingBooks();
    return {
      status: "success",
      data: {
        books,
      },
    };
  }

  async getRecomendationBooksHandler() {
    const books = await this._booksService.getRecomendationBooks();
    return {
      status: "success",
      data: {
        books,
      },
    };
  }

  async getHomeBooksHandler() {
    const bookreview = await this._booksService.getReviewHomeBook();
    const bookrating = await this._booksService.getRatingHomeBook();
    return {
      status: "success",
      data: {
        bookreview,
        bookrating,
      },
    };
  }
}

export default BooksHandler;
