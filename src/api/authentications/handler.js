import autoBind from "auto-bind";
import AuthenticationError from "../../exceptions/AuthenticationError.js";

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const { id, email, displayname, role } =
      await this._usersService.verifyUserCredential(username, password);
    const accessToken = this._tokenManager.generateAccessToken({
      id,
      email,
      displayname,
      role,
    });
    const refreshToken = this._tokenManager.generateRefreshToken({
      id,
      email,
      displayname,
      role,
    });
    await this._authenticationsService.addRefreshToken(refreshToken);

    h.state("refreshToken", { refreshToken: refreshToken });

    const response = h.response({
      status: "success",
      message: "Authentication berhasil ditambahkan",
      data: {
        accessToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    const refreshToken = request.state.refreshToken;
    if (!refreshToken) {
      throw new AuthenticationError("Refresh token tidak valid");
    }
    this._validator.validatePutAuthenticationPayload(refreshToken);
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id, email, displayname, role } =
      this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({
      id,
      email,
      displayname,
      role,
    });
    const response = h.response({
      status: "success",
      message: "Access Token berhasil diperbarui",
      data: {
        accessToken,
      },
    });
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    const refreshToken = request.state.refreshToken;
    if (!refreshToken) {
      throw new AuthenticationError("Refresh token tidak valid");
    }
    this._validator.validateDeleteAuthenticationPayload(refreshToken);
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: "success",
      message: "Refresh token berhasil dihapus",
    });
    response.unstate("refreshToken");
    return response;
  }
}

export default AuthenticationsHandler;
