const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._validator = validator;
    this._albumsService = albumsService;
    autoBind(this);
  }
 
  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateCoverHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
    await this._albumsService.editCoverAlbumById(id, {fileLocation});

    const response = h.response({
      status: 'success',
      message: 'Cover album berhasil ditambahkan'
    });

    response.code(201);
    return response;
}
}
module.exports = UploadsHandler;