const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');
 
class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
 
    autoBind(this);
  }
 
  async postExportSongsHandler(request, h) {
      this._validator.validateExportSongsPayload(request.payload);
      const { playlistId } = request.params;
      console.log(request.params)
      const message = {
        playlistId : playlistId,
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };
 
      await this._service.sendMessage('export:songs', JSON.stringify(message));
 
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
  }
}
 
module.exports = ExportsHandler;