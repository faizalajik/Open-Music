const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class MusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }
  async postMusicHandler(request, h) {

      this._validator.validateMusicPayload(request.payload);
      const { title, year, performer, genre, duration, albumId } = request.payload;
      const songId = await this._service.addMusic({ title, year, performer, genre, duration, albumId })

      const response = h.response({
        status: 'success',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
  }
  async getMusicHandler(request, h) {

      const { title, performer } = request.query;
      var songs = ''
      songs = await this._service.getMusic(title, performer);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
  }
  async getMusicByIdHandler(request, h) {

      const { id } = request.params;
      const song = await this._service.getMusicById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
  }

  async putMusicByIdHandler(request, h) {
      this._validator.validateMusicPayload(request.payload);
      const { title, year, performer, genre, duration, albumId } = request.payload;
      const { id } = request.params;

      await this._service.editMusicById(id, { title, year, performer, genre, duration, albumId });

      return {
        status: 'success',
        message: 'Music berhasil diperbarui',
      };
  }

  async deleteMusicByIdHandler(request, h) {
      const { id } = request.params;
      await this._service.deleteMusicById(id);

      return {
        status: 'success',
        message: 'Music berhasil dihapus',
      };
  }
}
module.exports = MusicHandler;