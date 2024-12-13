import routes from "./routes.js";
import RatingsHandler from "./handler.js";

export default {
  name: "ratings",
  version: "1.0.0",
  register: async (server, { RatingsService, BooksService, validator }) => {
    const handler = new RatingsHandler(RatingsService, BooksService, validator);
    server.route(routes(handler));
  },
};
