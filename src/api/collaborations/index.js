const MusicHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'music',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const collaborationHandler = new CollaborationHandler(service, validator);
    server.route(routes(collaborationHandler)); 
  },
};