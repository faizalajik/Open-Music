const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }
  async postPlaylistSongHandler(request, h) {
    const { id } = request.params;
    console.log(id)
    const { id: credentialId } = request.auth.credentials;
        this._validator.validatePlaylistSongPayload(request.payload);

        const {songId} = request.payload;
        await this._service.addSongToPlaylists(id,songId)
        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan'
          });
}

  async postPlaylistHandler(request, h) {

        const { id: credentialId } = request.auth.credentials;

        this._validator.validatePlaylistPayload(request.payload);

        const {name} = request.payload;
        const playlistId = await this._service.addPlaylists({ name, owner:credentialId })
        const response = h.response({
            status: 'success',
            data: {
              playlistId,
            },
          });
   
    response.code(201);
    return response;
}
async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._service.getPlaylists(credentialId )

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
}

  async getPlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getPlaylistsById(id);
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

  async putPlaylistByIdHandler(request, h) {
    try {
      this._validator.validatePlaylistsPayload(request.payload);
      const { title, year, performer, genre, duration, albumId } = request.payload;
      const { id } = request.params;

      await this._service.editPlaylistsById(id, { title, year, performer, genre, duration, albumId });

      return {
        status: 'success',
        message: 'Playlists berhasil diperbarui',
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

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deletePlaylistsById(id);

      return {
        status: 'success',
        message: 'Playlists berhasil dihapus',
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
module.exports = PlaylistsHandler;