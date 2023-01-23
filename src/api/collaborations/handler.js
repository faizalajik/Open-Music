const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(service, validator) {
    this._service = service;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {

    const { id: credentialId } = request.auth.credentials;

    const {playlistId,userId} = request.payload;
    const collaborationId = await this._service.addCollaborator({ playlistId,userId, owner:credentialId })
    const response = h.response({
        status: 'success',
        data: {
            collaborationId,
        },
      });

response.code(201);
return response;
}
}
module.exports = CollaborationHandler;