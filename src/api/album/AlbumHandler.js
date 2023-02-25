const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }
  async postAlbumHandler(request, h) {
  
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year })

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
  }

  async postAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const { id: credentialId } = request.auth.credentials;
    const message = await this._service.likeAlbum(credentialId, id)

    const response = h.response({
      status: 'success',
      message: message,
    });
    response.code(201);
    return response;
}

  async getAlbumByIdHandler(request, h) {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      const result = { status: 'success', data: album }
      return result;
  }
  async getAlbumLikesByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumLikeById(id);
    const result = { status: 'success', data: album }
    return result;
}

  async putAlbumByIdHandler(request, h) {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params;

      await this._service.editAlbumById(id, { name, year });

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
  }

  async deleteAlbumByIdHandler(request, h) {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
  }

}

module.exports = AlbumHandler;