import routes from "./routes.js";
import BooksHandler from "./handler.js";

export default {
  name: "books",
  version: "1.0.0",
  register: async (server, { booksService, storageService, validator }) => {
    const booksHandler = new BooksHandler(
      booksService,
      storageService,
      validator
    );
    server.route(routes(booksHandler));
  },
};
