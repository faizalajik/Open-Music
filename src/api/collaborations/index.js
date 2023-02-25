const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const collaborationHandler = new CollaborationHandler(service, playlistsService, validator);
    server.route(routes(collaborationHandler));
  },
};