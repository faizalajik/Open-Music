const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapPlaylistDBToModel } = require('../../utils/playlistModel');
const { mapMusicDBToModel } = require('../../utils/musicModel');
const { mapActivitiesBToModel } = require('../../utils/activitiesModel');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }
  async addCollaborator({ playlistId,userId, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO col VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Collaboration gagal ditambahkan');
    }

    return result.rows[0].id;
  }
}

module.exports = CollaborationsService;