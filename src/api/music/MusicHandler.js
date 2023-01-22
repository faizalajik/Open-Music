const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class MusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }
  async postMusicHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  async getMusicHandler(request, h) {
    try {
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
    catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }

  }
  async getMusicByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getMusicById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putMusicByIdHandler(request, h) {
    try {
      this._validator.validateMusicPayload(request.payload);
      const { title, year, performer, genre, duration, albumId } = request.payload;
      const { id } = request.params;

      await this._service.editMusicById(id, { title, year, performer, genre, duration, albumId });

      return {
        status: 'success',
        message: 'Music berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteMusicByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteMusicById(id);

      return {
        status: 'success',
        message: 'Music berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = MusicHandler;