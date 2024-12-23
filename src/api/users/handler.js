import autoBind from "auto-bind";

class UsersHandler {
  constructor(usersService, storageService, validator) {
    this._service = usersService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, email, password } = request.payload;
    const userId = await this._service.addUser({
      username,
      email,
      password,
    });
    const response = h.response({
      status: "success",
      message: "User berhasil ditambahkan",
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async putDisplaynameHandler(request, h) {
    // this._validator.validateUserPayload(request.payload);
    const { id: user_id } = request.auth.credentials;
    const { displayname } = request.payload;
    await this._service.editUserDisplaynameById(user_id, displayname);
    const response = h.response({
      status: "success",
      message: "User berhasil diubah",
    });
    response.code(200);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id: user_id } = request.auth.credentials;
    const user = await this._service.getUserById(user_id);
    const response = h.response({
      status: "success",
      data: {
        user,
      },
    });
    response.code(200);
    return response;
  }

  async postProfilePictureHandler(request, h) {
    const { id: user_id } = request.auth.credentials;
    const { cover } = request.payload;
    this._validator.validateProfilePictureHeader(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/api/images/profile/${filename}`;
    await this._service.editUserProfilePictureById(user_id, url);
    const response = h.response({
      status: "success",
      message: "Foto profil berhasil diunggah",
    });
    response.code(201);
    return response;
  }

  async getAllUsersHandler(request, h) {
    const users = await this._service.getAllUsers();
    const response = h.response({
      status: "success",
      data: {
        users,
      },
    });
    response.code(200);
    return response;
  }

  async postAdminHandler(request, h) {
    const { id } = request.payload;
    await this._service.addAdmin(id);
    const response = h.response({
      status: "success",
      message: "Admin berhasil ditambahkan",
    });
    response.code(201);
    return response;
  }

  async deleteProfilePictureHandler(request, h) {
    const { id: user_id } = request.auth.credentials;
    const { id, profile_image_url } =
      await this._service.deleteUserProfilePictureById(user_id);
    let filenameDelete;

    filenameDelete = profile_image_url.split("/api/images/profile/").pop();
    await this._storageService.deleteFile(filenameDelete);
    const response = h.response({
      status: "success",
      message: "Foto profil berhasil dihapus",
    });
    response.code(200);
    return response;
  }
}

export default UsersHandler;
