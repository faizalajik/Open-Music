const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    // this.validatorAddSong = validatorAddSong;

    autoBind(this);
  }
  async postPlaylistSongHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    this._validator[1].validatePlaylistSongPayload(request.payload);

    const {songId} = request.payload;
    await this._service.addSongToPlaylists(id,songId,credentialId)
    const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan'
      });
      response.code(201);
      return response;
}

  async postPlaylistHandler(request, h) {

        const { id: credentialId } = request.auth.credentials;

        this._validator[0].validatePlaylistPayload(request.payload);

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
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const res = await this._service.getPlaylistsById(id, credentialId);
      const result = { status: 'success', data: res }

      return result
  }

  async deleteSongPlaylistByIdHandler(request, h) {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      this._validator[1].validatePlaylistSongPayload(request.payload);

      const {songId} = request.payload;
      await this._service.deleteSongPlaylistsById(id,songId,credentialId);

      return {
        status: 'success',
        message: 'Lagu di playlists berhasil dihapus',
      };
  }
  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.deletePlaylistsById(id,credentialId);

    return {
      status: 'success',
      message: 'Playlists berhasil dihapus',
    };
}
}
module.exports = PlaylistsHandler;