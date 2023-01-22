const AlbumHandler = require('./AlbumHandler');
const routes = require('./routes');
 
module.exports = {
  name: 'open_music',
  version: '1.0.0',
  register: async (server, { service, validator }) => {

    const albumHandler = new AlbumHandler(service, validator);
    server.route(routes(albumHandler));
  },
};