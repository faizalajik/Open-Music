require('dotenv').config();
const AlbumService = require('./services/postgres/AlbumService.js');
const MusicService = require('./services/postgres/MusicService.js');
const { AlbumValidator, MusicValidator } = require('./validator');
const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const music = require('./api/music');

const users = require('./api/user');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const albumService = new AlbumService();
  const musicService = new MusicService();
  const usersService = new UsersService();
  // const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: music,
      options: {
        service: musicService,
        validator: MusicValidator,
      },
    }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();