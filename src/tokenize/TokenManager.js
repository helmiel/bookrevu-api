import Jwt from "@hapi/jwt";
import InvariantError from "../exceptions/InvariantError.js";

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken.refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { id, email, displayname, role } = artifacts.decoded.payload;
      return { id, email, displayname, role };
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

export default TokenManager;
