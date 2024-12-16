import Jwt from "@hapi/jwt";

const ServerTestHelper = {
  getAccessToken: async () => {
    const payloadUser = {
      id: `user-123`,
      username: "user",
      email: "jw9m5@example.com",
      displayname: "user",
      password: "secret",
      role: "admin",
    };
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
  },
};

export default ServerTestHelper;
