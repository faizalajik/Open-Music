const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async postCollaborationsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    this._validator.validateCollaborationPayload(request.payload);
    const {playlistId,userId} = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId,credentialId)
    
    const collaborationId = await this._service.addCollaborator(playlistId,userId)
    const response = h.response({
        status: 'success',
        data: {
          collaborationId,
        },
      });

response.code(201);
return response;
}
async deleteCollaborationByIdHandler(request, h) {
  const { id: credentialId } = request.auth.credentials;
  this._validator.validateCollaborationPayload(request.payload);
  const {playlistId,userId} = request.payload;

  await this._playlistsService.verifyPlaylistOwner(playlistId,credentialId)
  
  await this._service.deleteCollaboration(playlistId,userId);

  return {
    status: 'success',
    message: 'Collaboratiion berhasil dihapus',
  };
}
}
module.exports = CollaborationHandler;