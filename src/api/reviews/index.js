import routes from "./routes.js";
import ReviewsHandler from "./handler.js";

export default {
  name: "reviews",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const handler = new ReviewsHandler(service, validator);
    server.route(routes(handler));
  },
};
